import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe, Put, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileUploadDto } from './dto/file-upload.dto';
import { SearchProductDto } from './dto/search-product.dto';
import { PaginateDto } from './dto/paginate.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Post('upload/image/product')
  uploadImage(@Body() fileUploadDto: FileUploadDto) {
    return this.productsService.uploadImages(fileUploadDto);
  }

  @Get()
  findAll(@Query() paginateDto: PaginateDto) {
    return this.productsService.findAll(paginateDto);
  }

  @Get('admin')
  findAllAdmin(@Query() paginateDto: PaginateDto) {
    return this.productsService.findAllProductsAdmin(paginateDto);
  }

  @Get('product/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Get('product/detail/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.productsService.findProductBySlug(slug);
  }

  @Get('search')
  search(@Query() searchProductDto: SearchProductDto) {
    return this.productsService.searchProduct(searchProductDto);
  }

  @Get('category/:id')
  findByCategory(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findProductByCategory(id);
  }

  @Put('product/:id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete('product/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }
}
