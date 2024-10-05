import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './models/product.model';
import { ResponseData } from 'src/core/interfaces/response-data.interface';
import { Category } from '../categories/models/category.model';
import { Op } from 'sequelize';
import { HttpService } from '@nestjs/axios';
import { FileUploadDto } from './dto/file-upload.dto';
import { ImagesProduct } from './models/image.model';

@Injectable()
export class ProductsService {

  constructor(private readonly httpService: HttpService) {}

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

  async findProductBySlug(slug: string): Promise<ResponseData> {

    const product = await Product.findOne<Product>({ where: { slug } });

    if(!product) throw new NotFoundException("Producto no encontrado");

    return {
      statusCode: HttpStatus.OK,
      message: "Producto encontrado",
      data: product
    }
  }

  async findProductByCategory(idCategory: number): Promise<ResponseData> {

    const products = await Product.findAll<Product>({ where: { idCategory } });

    if(products.length === 0) throw new NotFoundException("No se encontraron productos en esta categoria");

    return {
      statusCode: HttpStatus.OK,
      message: "Productos encontrados",
      data: products
    }
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

  async uploadImages(fileUpload: FileUploadDto){

    const { file, filename, type, idProduct, typeFormat } = fileUpload;

    const [filenameImage, extendsImage] = filename.split(".");
    
    const nowDate = new Date();
    const newFileNameImage = filenameImage + "-" + new Intl.DateTimeFormat('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(nowDate).toString() + "-" + nowDate.getTime().toString() + "." + extendsImage;
    const dataForm = new FormData();

    dataForm.append(
      'file', 
      new Blob([Buffer.from(file, 'base64')], { type: typeFormat }), 
      newFileNameImage
    );

    try {
      
      await this.httpService.axiosRef.post("http://127.0.0.1:8000/upload", dataForm, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    } catch (error) {

      if(error.code === "ECONNREFUSED") throw new BadRequestException("No se envio correctamente al proveedor de imagenes");
    }

    const product = await Product.findByPk<Product>(idProduct);
    
    if(!product) throw new NotFoundException("Producto no encontrado");

    try {
      
      await ImagesProduct.create<ImagesProduct>({
        urlImage: `/media/${newFileNameImage}`,
        type,
        idProduct
      })
    } catch (error) {

      throw new BadRequestException("No se guardo la imagen correctamente");
    }

    return {
      statusCode: HttpStatus.OK,
      message: "Imagen subida correctamente",
      data: {
        filename,
        type
      }
    }
  }
}
