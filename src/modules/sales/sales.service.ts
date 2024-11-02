import { BadRequestException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { Sale, SaleProduct } from './models/sale.model';
import { Cart } from '../cart/models/cart.model';
import { Item } from '../cart/models/item.model';
import { ResponseData } from 'src/core/interfaces/response-data.interface';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { CreateTransbankDto } from './dto/create-transbank.dto';
import { Product } from '../products/models/product.model';
import { UpdateSaleDto } from './dto/update-status-sale.dto';
import { Shipping } from '../shippings/models/shipping.model';
import { StatusSaleEnum } from 'src/core/enums/statusSale.enum';
import { ShippingStatusEnum, WithdrawalEnum } from 'src/core/enums/statusShipping.enum';
import { ProductsService } from '../products/products.service';
import { randomUUID } from 'crypto';

@Injectable()
export class SalesService {

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly productService: ProductsService
  ) {}

  async create(createSaleDto: CreateSaleDto, idUser: number):Promise<ResponseData> {

    let { priceTotal, productsQuantity, discountApplied, withdrawal } = createSaleDto;

    const cartUser = await Cart.findOne({
      where: {
        idCartUser: idUser
      },
      include: {
        model: Item
      }
    });

    if(cartUser.items.length === 0) throw new BadRequestException('El carrito esta vacio');

    try {
      
      const newSale = await Sale.create({

        priceIva: this.calculateIvaPrice(priceTotal),
        priceNet: this.calculateNetPrice(priceTotal),
        priceTotal,
        productsQuantity,
        discountApplied,
        withdrawal,
        status: StatusSaleEnum.PENDING,
        idUser
      });

      cartUser.items.forEach(async item => {
        await SaleProduct.create({
          idSale: newSale.idSale,
          idProduct: item.idProduct,
          priceUnit: item.priceUnit,
          quantity: item.quantity
        });

        await item.destroy();
      });

      cartUser.quantityTotal = 0;
      cartUser.priceTotal = 0;
      cartUser.productsTotal = 0;
      cartUser.priceTotalDiscount = 0;

      await cartUser.save();
      
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Venta creada con exito',
        data: newSale
      };
    } catch (error) {  
      throw new InternalServerErrorException('Error No se pudo crear la venta');
    }
  }

  async findUserSales(idUser: number): Promise<ResponseData> {

    const sales = await Sale.findAll({
      where: {
        idUser
      },
      include: [
        {
          model: SaleProduct,
          include: [
            {
              model: Product,
              attributes: ['title', 'price']
            }
          ],
          attributes: ['quantity']
        },
        {
          model: Shipping
        }
      ]
    });

    if(sales.length === 0) throw new BadRequestException('No se encontraron ventas para el usuario');

    return {
      statusCode: HttpStatus.OK,
      data: sales
    };
  }

  async updateStatusSale(idSale: string, updateSaleDto: UpdateSaleDto): Promise<ResponseData> {

    const { status, shipping } = updateSaleDto;

    const sale = await Sale.findByPk(idSale);

    if(!sale) throw new NotFoundException('No se encontro la venta');
    if(sale.statusPayment === StatusSaleEnum.PAID) throw new BadRequestException('La venta ya se encuentra pagada');

    sale.statusPayment = status;

    try {      
      
      if(sale.statusPayment === StatusSaleEnum.PAID && sale.withdrawal === WithdrawalEnum.DELIVERY) {
  
        await Shipping.create({
          idShippingSale: sale.idSale,
          ...shipping,
          trackingNumber: randomUUID().split('-')[0].toUpperCase()
        })
      }

      await sale.save();

    } catch (error) {

      console.log(error);
      throw new InternalServerErrorException('Error al actualizar el estado de la venta');
    }


    return {

      statusCode: HttpStatus.OK,
      message: 'Estado de la venta actualizado con exito'
    }
  }

  async createTransbankTransaction(createTransbankDto: CreateTransbankDto): Promise<ResponseData> {

    const { buyOrder, sessionId, amount, returnUrl } = createTransbankDto;

    try {
      const responseTransbank = await this.httpService.axiosRef.post('https://webpay3gint.transbank.cl/rswebpaytransaction/api/webpay/v1.2/transactions', {
        buy_order: buyOrder,
        session_id: sessionId,
        amount,
        return_url: returnUrl
      }, {
        headers: this.headerRequestTransbank()
      });

      if(responseTransbank.status === 200) return {
        statusCode: HttpStatus.CREATED,
        message: 'Transaccion creada con exito',
        data: responseTransbank.data
      }

    } catch (error) {
      throw new BadRequestException('No se pudo crear la transaccion');
    }
  }

  async commitTransbankTransaction(token: string): Promise<ResponseData> {
      
    try {
      const responseTransbank = await this.httpService.axiosRef.put(`https://webpay3gint.transbank.cl/rswebpaytransaction/api/webpay/v1.2/transactions/${token}`, {}, {
        headers: this.headerRequestTransbank()
      });

      if(responseTransbank.status === 200) return {
        statusCode: HttpStatus.OK,
        message: 'Transaccion confirmada con exito',
        data: responseTransbank.data
      }
    } catch (error) {

      throw new BadRequestException('No se pudo confirmar la transaccion');
    }
  }

  private headerRequestTransbank() {
    
    return {
      "Authorization": "Token",
      "Tbk-Api-Key-Id": this.configService.get<string>('tbkApiKeyId'),
      "Tbk-Api-Key-Secret": this.configService.get<string>('tbkApiKeySecret'),
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      'Referrer-Policy': 'origin-when-cross-origin',
      }
  }

  private calculateIvaPrice(priceTotal: number): number {

    return priceTotal - this.calculateNetPrice(priceTotal);
  }

  private calculateNetPrice(priceTotal: number): number {

    let percentageIva = 19 / 100;
    let netPrice = priceTotal - priceTotal * percentageIva;
    return netPrice;
  }

  private async validateStatusSale(status: string, sale: Sale): Promise<void> {

    if(status === ShippingStatusEnum.DELIVERED){

      const products = await SaleProduct.findAll({
        where: {
          idSale: sale.idSale
        }
      });
  
      products.forEach(async productSale => {
  
        const product = await Product.findByPk(productSale.idProduct);
  
        if(product.stock < productSale.quantity) throw new BadRequestException('No hay stock suficiente para la venta');
  
        product.stock -= productSale.quantity;
        product.sold += productSale.quantity;

        await this.productService.validAvaibilityStatus(product.idProduct);
        await product.save();
      });
  
      sale.statusOrder = status;
      await sale.save();
    }
  }
}
