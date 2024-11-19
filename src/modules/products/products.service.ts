import { BadRequestException, ConflictException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './models/product.model';
import { ResponseData } from 'src/core/interfaces/response-data.interface';
import { Category } from '../categories/models/category.model';
import { Op } from 'sequelize';
import { HttpService } from '@nestjs/axios';
import { FileUploadDto } from './dto/file-upload.dto';
import { ImagesProduct } from './models/image.model';
import { Offer } from '../offers/models/offer.model';
import { randomUUID } from 'crypto';
import { SearchProductDto } from './dto/search-product.dto';
import { PaginateDto } from './dto/paginate.dto';
import { AvailabilityStatus } from 'src/core/enums/productAviabilityStatus.enum';
import { ConfigService } from '@nestjs/config';
import { TypeImagesEnum } from 'src/core/enums/typeImages.enum';

@Injectable()
export class ProductsService {

  constructor(
    private readonly httpService: HttpService, 
    private readonly configService: ConfigService
  ) {}

  async create(createProductDto: CreateProductDto):Promise<ResponseData> {

    const { title, brand, returnPolicy, price, description, idCategory, idOffer } = createProductDto;

    const category = await Category.findByPk<Category>(idCategory);
    const offer = await Offer.findByPk<Offer>(idOffer);

    await this.validTitleProduct(title);
    if(!offer && idOffer) throw new BadRequestException("La oferta ingresada no existe");
    if(!category) throw new BadRequestException("La categoria ingresada no existe");

    try{

      const newProduct = await Product.create<Product>({
        title,
        brand,
        price,
        priceDiscount: await this.calculateDiscount(price, idOffer),
        slug: this.generateSlug(title),
        returnPolicy,
        description,
        idCategory,
        idOffer
      });

      return {
        statusCode: HttpStatus.CREATED,
        message: "Producto creado",
        data: newProduct
      }
    } catch (error) {
      throw new InternalServerErrorException("No se guardo el producto correctamente");
    }
  }

  async findAll(paginateDto: PaginateDto): Promise<ResponseData> {

    let { page, limit } = paginateDto;

    if(!page) page = 1;
    if(!limit) limit = 20;

    const offset = (page - 1) * limit;
    const products = await Product.findAll<Product>({
      include: this.includeConfigProduct(),
      where: { published: true, idOffer: { [Op.is]: null } },
      limit,
      offset
    });
    
    if(products.length === 0) return { message: "No tenemos productos registrados", statusCode: HttpStatus.NO_CONTENT }
    
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(await Product.count() / limit);

    return {
      statusCode: HttpStatus.OK,
      count: products.length,
      currentPage,
      totalPages,
      data: products
    };
  }

  async findAllProductsAdmin(paginateDto: PaginateDto): Promise<ResponseData> {

    let { page, limit } = paginateDto;

    if(!page) page = 1;
    if(!limit) limit = 20;

    const offset = (page - 1) * limit;
    const products = await Product.findAll<Product>({
      include: this.includeConfigProduct(),
      limit,
      offset
    });

    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(await Product.count() / limit);

    if(products.length === 0) return { message: "No tenemos productos registrados", statusCode: HttpStatus.NO_CONTENT }

    return {
      statusCode: HttpStatus.OK,
      count: products.length,
      currentPage,
      totalPages,
      data: products
    };
  }

  async findOne(id: number): Promise<ResponseData> {

    const product = await Product.findOne<Product>({
      where: { idProduct: id },
      include: this.includeConfigProduct()
    });

    if(!product) throw new NotFoundException("Producto no encontrado");

    return {
      statusCode: HttpStatus.OK,
      message: "Producto encontrado",
      data: product
    };
  }

  async findProductBySlug(slug: string): Promise<ResponseData> {

    const product = await Product.findOne<Product>(
      { where: { slug, published: true  },
      include: this.includeConfigProduct(),
    }
    );

    if(!product) throw new NotFoundException("Producto no encontrado");

    return {
      statusCode: HttpStatus.OK,
      message: "Producto encontrado",
      data: product
    }
  }

  async findProductByCategory(idCategory: number): Promise<ResponseData> {

    const products = await Product.findAll<Product>(
      { where: { idCategory },
      include: this.includeConfigProduct()
    });

    if(products.length === 0) throw new NotFoundException("No se encontraron productos en esta categoria");

    return {
      statusCode: HttpStatus.OK,
      message: "Productos encontrados",
      data: products
    }
  }

  async searchProduct(searchProductDto: SearchProductDto): Promise<ResponseData> {

    let { title, category } = searchProductDto;

    if(!title) title = "";
    if(!category) category = 0;

    const whereCondition: any = {};

    if (title !== "") whereCondition.title = { [Op.iLike]: `%${title}%` };
    if (category !== 0) whereCondition.idCategory = category;

    whereCondition.published = true; 

    const products = await Product.findAll<Product>(
      { where: whereCondition,
      include: this.includeConfigProduct()
    });

    if(products.length === 0) throw new NotFoundException("No se encontraron productos con ese titulo");

    return {
      statusCode: HttpStatus.OK,
      message: "Productos encontrados",
      data: products
    }
  }

  async findAllProductsOffer(): Promise<ResponseData> {

    const products = await Product.findAll<Product>({
      where: { idOffer: { [Op.not]: null } },
      include: this.includeConfigProduct()
    });

    if(products.length === 0) return { message: "No tenemos productos con ofertas registrados", statusCode: HttpStatus.NO_CONTENT }

    return {
      statusCode: HttpStatus.OK,
      message: "Productos encontrados",
      data: products
    }
  }

  async searchProductsOffer(searchProductDto: SearchProductDto): Promise<ResponseData> {

    let { title, category } = searchProductDto;

    if(!title) title = "";
    if(!category) category = 0;

    const whereCondition: any = {};

    if (title !== "") whereCondition.title = { [Op.iLike]: `%${title}%` };
    if (category !== 0) whereCondition.idCategory = category;
    whereCondition.idOffer = { [Op.not]: null };

    const products = await Product.findAll<Product>(
      { where: whereCondition,
      include: this.includeConfigProduct()
    });

    if(products.length === 0) throw new NotFoundException("No se encontraron productos con ese titulo");

    return {
      statusCode: HttpStatus.OK,
      message: "Productos encontrados",
      data: products
    }
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<ResponseData> {

    const { title, brand, returnPolicy, price, description, published, idCategory, idOffer } = updateProductDto;

    const product = await Product.findByPk<Product>(id);
    const category = await Category.findByPk<Category>(idCategory);

    if(!product) throw new NotFoundException("Producto no encontrado");
    if(!category) throw new BadRequestException("La categoria ingresada no existe");
    if(product.title !== title) await this.validTitleProduct(title);

    try {
      product.title = title;
      product.brand = brand;
      product.price = price;
      product.published = published;
      product.priceDiscount = await this.calculateDiscount(price, idOffer);
      product.slug = this.generateSlug(title);
      product.returnPolicy = returnPolicy;
      product.description = description;
      product.idCategory = idCategory;
      product.idOffer = idOffer;
  
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

    const imageBuffer = Buffer.from(file, 'base64');

    const product = await Product.findByPk<Product>(idProduct);
    const imageProduct = await ImagesProduct.findOne<ImagesProduct>({ where: { idProduct, type } });

    if(!product) throw new NotFoundException("Producto no encontrado");
    if(imageProduct) {
      await this.httpService.axiosRef.delete(`${this.configService.get<string>("s3AwsUrl")}/media/${imageProduct.urlImage.split("/")[2]}`);
      await imageProduct.destroy();
    };

    try {
      
      await this.httpService.axiosRef.put(`${this.configService.get<string>("s3AwsUrl")}/media/${newFileNameImage}`, imageBuffer, {
        headers: {
          'Content-Type': typeFormat,
          'Content-Length': imageBuffer.length
      }
      });
    } catch (error) {
      throw new BadRequestException("No se envio correctamente al proveedor de imagenes");
    }

    try {
      
      await ImagesProduct.create<ImagesProduct>({
        urlImage: `/media/${newFileNameImage}`,
        type,
        idProduct
      })
    } catch (error) {

      throw new InternalServerErrorException("No se guardo la imagen correctamente");
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

  async getImagesProduct(idProduct: number) {

    const product = await Product.findByPk<Product>(idProduct);
    const images = await ImagesProduct.findOne<ImagesProduct>({ where: { idProduct, type: TypeImagesEnum.COVER } });

    if(!images) throw new NotFoundException("Producto no tiene imagenes");
    if(!product) throw new NotFoundException("Producto no encontrado");  

    try {

      const response = await this.httpService.axiosRef.get(`${this.configService.get<string>("s3AwsUrl") + images.urlImage}`, { responseType: 'arraybuffer' });

      const buffer = Buffer.from(response.data, 'binary');

      return {
        statusCode: HttpStatus.OK,
        message: "Imagenes encontradas",
        data: {
          type: images.type,
          filename: images.urlImage.split("/")[2],
          image: buffer.toString('base64')
        }
      }
    } catch (error) {
      throw new InternalServerErrorException("No se pudo obtener las imagenes del producto");
    }

  }

  private async calculateDiscount(price: number, idOffer: number): Promise<number> {

    if(idOffer){

      const offer = await Offer.findByPk(idOffer);
  
      if(!offer) throw new NotFoundException("La oferta ingresada no existe");
  
      return price - (price * offer.discount / 100);
    }

    return 0;
  }

  private generateSlug(title: string): string {
    
    const slug = title.toLowerCase().replace(/ /g, "-");
    return slug + "-" + randomUUID().split("-").join("");
  }

  public async validAvaibilityStatus(idProduct: number): Promise<void> {

    const product = await Product.findByPk<Product>(idProduct);

    if(product.stock > 0 && product.stock <= 10) product.availabilityStatus = AvailabilityStatus.LowStock;
    if(product.stock > 10) product.availabilityStatus = AvailabilityStatus.InStock;

    product.save();
  }

  private includeConfigProduct(): any[]{

    return [
      {
        model: ImagesProduct,
        attributes: ['urlImage', 'type']
      },
      {
        model: Category,
        attributes: ['idCategory', 'name']
      },
      {
        model: Offer,
        attributes: ['idOffer', 'title', 'discount']
      }
    ]
  }

  private async validTitleProduct(title: string): Promise<void> {
    
    const product = await Product.findOne<Product>({ where: { title: { [Op.iLike]: title } } });

    if(product) throw new ConflictException("Ya existe un producto con ese titulo");
  }
}
