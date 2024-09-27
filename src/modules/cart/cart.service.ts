import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Item } from './models/item.model';
import { Product } from '../products/models/product.model';
import { Cart } from './models/cart.model';
import { ResponseData } from 'src/core/interfaces/response-data.interface';
import { AddItemCartDto } from './dto/add-item-cart.dto';
import { SubstractItemCartDto } from './dto/substract-item-cart.dto';

@Injectable()
export class CartService {

    async findCartUser(idUser: number): Promise<ResponseData>{

        const cart = await Cart.findOne<Cart>({
            where: {
                idCartUser: idUser
            },
            include: [
                {
                    model: Item,
                    attributes: ["quantity", "priceUnit", "idProduct"],
                    include: [
                        {
                            model: Product,
                            attributes: ["title", "price", "stock"]
                        }
                    ]
                }
            ],
            
        });

        cart.priceTotal = this.cartTotal(cart);
        cart.quantityTotal = this.cartQuantity(cart);
        cart.productsTotal = this.cartProducts(cart);

        if(!cart) throw new NotFoundException("Carrito no encontrado");

        return {
            statusCode: HttpStatus.OK,
            message: "Carrito encontrado",
            data: cart
        }
    }

    async addItemToCart(addItemCartDto: AddItemCartDto, idUser: number): Promise<ResponseData>{

        const { idProduct, quantity } = addItemCartDto;

        const product = await Product.findByPk<Product>(idProduct);
        const cart = await this.getCartUser(idUser);

        if(!cart) throw new NotFoundException("Carrito no encontrado");
        if(!product) throw new NotFoundException("Producto no encontrado");
        if(product.stock < quantity) throw new BadRequestException("No hay suficiente stock");

        const item = await Item.findOne<Item>({
            where: {
                idProduct,
                idCartUser: cart.idCartUser
            }
        });

        await this.validItem(item, quantity, product, cart);

        cart.priceTotal = this.cartTotal(cart);

        return {
            statusCode: HttpStatus.OK,
            message: "Producto agregado al carrito con exito"
        }
    }

    async subsctractItemCart(subsctractItemCartDto: SubstractItemCartDto, idUser: number): Promise<ResponseData>{

        const { idProduct } = subsctractItemCartDto;

        const item = await Item.findOne<Item>({
            where: {
                idProduct,
                idCartUser: idUser
            },
            include: [
                {
                    model: Product
                }
            ]
        });
        const cart = await this.getCartUser(idUser);

        if(!item) throw new NotFoundException("Item no encontrado");
        if(item.quantity === 1) await item.destroy();

        item.quantity -= 1;
        item.priceUnit = item.quantity * item.product.price;
        await item.save();

        cart.priceTotal = this.cartTotal(cart);
        cart.quantityTotal = this.cartQuantity(cart);
        cart.productsTotal = this.cartProducts(cart);

        return {
            statusCode: HttpStatus.OK,
            message: "Producto restado del carrito con exito"
        }
    }

    async removeItemCart(idProduct: number, idUser: number): Promise<ResponseData>{

        const cart = await this.getCartUser(idUser);
        
        const item = await Item.findOne<Item>({
            where: {
                idProduct,
                idCartUser: idUser
            }
        })

        if(!item) throw new NotFoundException("Item no encontrado");

        await item.destroy();

        cart.priceTotal = this.cartTotal(cart);
        cart.quantityTotal = this.cartQuantity(cart);
        cart.productsTotal = this.cartProducts(cart);

        return {
            statusCode: HttpStatus.OK,
            message: "Producto eliminado del carrito con exito"
        }
    }

    async clearCart(idUser: number): Promise<ResponseData>{

        const cart = await this.getCartUser(idUser);

        if(!cart) throw new NotFoundException("Carrito no encontrado");

        await Item.destroy({
            where: {
                idCartUser: idUser
            }
        });

        cart.priceTotal = this.cartTotal(cart);
        cart.quantityTotal = this.cartQuantity(cart);
        cart.productsTotal = this.cartProducts(cart);

        return {
            statusCode: HttpStatus.OK,
            message: "Carrito limpiado con exito"
        }
    }

    private async getCartUser(idUser: number): Promise<Cart>{
        return await Cart.findOne<Cart>({
            where: {
                idCartUser: idUser
            },
            include: [
                {
                    model: Item
                }
            ]
        });
    }

    private cartTotal(cart: Cart): number{

        let total = 0;

        cart.items.forEach(item => {
            total += item.priceUnit;
        });

        return total;
    }

    private cartQuantity(cart: Cart): number {

        let total = 0;

        cart.items.forEach(item => {
            total += item.quantity;
        });

        return total;
    }

    private cartProducts(cart: Cart): number {
        return cart.items.length;
    }

    private async validItem(item: Item, quantity: number, product: Product, cart: Cart): Promise<void> {

        if(item){
            item.quantity += quantity;
            item.priceUnit = item.quantity * product.price;
            await item.save();
        } else {

            const priceUnit = product.price * quantity;

            await Item.create<Item>({
                quantity,
                priceUnit,
                idCartUser: cart.idCartUser,
                idProduct: product.idProduct
            });
            
        }
    }
}
