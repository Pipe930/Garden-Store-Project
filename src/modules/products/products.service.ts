import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './models/product.model';
import { ResponseData } from 'src/core/interfaces/response-data.interface';
import { Category } from '../categories/models/category.model';
import { Op } from 'sequelize';

@Injectable()
export class ProductsService {

  async create(createProductDto: CreateProductDto):Promise<ResponseData> {

    const { title, brand, returnPolicy, price, description, idCategory } = createProductDto;

    const product = await Product.findOne<Product>({ where: { title: { [Op.iLike]: title } } });
    const category = await Category.findByPk<Category>(idCategory);

    if(product) throw new BadRequestException("Ya existe un producto con ese titulo");
    if(!category) throw new BadRequestException("La categoria ingresada no existe");

    try{

      const newProduct = await Product.create<Product>({
        title,
        brand,
        price,
        slug: "",
        returnPolicy,
        description,
        idCategory
      });

      return {
        statusCode: HttpStatus.CREATED,
        message: "Producto creado",
        data: newProduct
      }
    } catch (error) {

      throw new BadRequestException("No se guardo el producto correctamente");
    }
  }

  async findAll(): Promise<ResponseData> {

    const products = await Product.findAll<Product>();

    if(products.length === 0) return { message: "No tenemos usuarios registrados", statusCode: HttpStatus.NO_CONTENT }

    return {
      statusCode: HttpStatus.OK,
      message: "Lista de productos",
      data: products
    };
  }

  async findOne(id: number): Promise<ResponseData> {

    const product = await Product.findByPk<Product>(id);

    if(!product) throw new NotFoundException("Producto no encontrado");

    return {
      statusCode: HttpStatus.OK,
      message: "Producto encontrado",
      data: product
    };
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<ResponseData> {

    const { title, brand, returnPolicy, price, description, idCategory } = updateProductDto;

    const product = await Product.findByPk<Product>(id);
    const category = await Category.findByPk<Category>(idCategory);
    
    if(!product) throw new NotFoundException("Producto no encontrado");
    if(!category) throw new BadRequestException("La categoria ingresada no existe");

    try {
      product.title = title;
      product.brand = brand;
      product.price = price;
      product.returnPolicy = returnPolicy;
      product.description = description;
      product.idCategory = idCategory;
  
      await product.save();
    } catch (error) {
      throw new BadRequestException("No se guardo el producto correctamente");  
    }

    return {
      statusCode: HttpStatus.OK,
      message: "El producto a sido actualizado con exito",
      data: product
    };
  }

  async remove(id: number): Promise<ResponseData> {

    const product = await Product.findByPk<Product>(id);

    if(!product) throw new NotFoundException("Producto no encontrado");

    await product.destroy();

    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: "El producto a sido eliminado con exito"
    };
  }
}
