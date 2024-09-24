import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './models/category.model';
import { ResponseData } from 'src/core/interfaces/response-data.interface';
import { Op } from 'sequelize';

@Injectable()
export class CategoriesService {


  async create(createCategoryDto: CreateCategoryDto): Promise<ResponseData> {

    const { name, slug, description } = createCategoryDto;

    const category = await Category.findOne({ where: { name: { [Op.iLike]: name } } });

    if(category) throw new NotFoundException("El nombre de la categoria ya existe");

    const newCategory = await Category.create({ name, slug, description });

    return {
      statusCode: HttpStatus.CREATED,
      message: "Categoria creada correctamente",
      data: newCategory
    };
  }

  async findAll(): Promise<ResponseData> {

    const categories = await Category.findAll();

    if(categories.length === 0) throw new NotFoundException("No tenemos categorias registradas");

    return {
      statusCode: HttpStatus.OK,
      data: categories
    };
  }

  async findOne(id: number): Promise<ResponseData> {

    const category = await Category.findByPk(id);

    if(!category) throw new NotFoundException("La categoria no existe");

    return {
      statusCode: HttpStatus.OK,
      message: "Categoria encontrada con exito",
      data: category
    };
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<ResponseData> {

    const { name, description } = updateCategoryDto;

    const category = (await this.findOne(id)).data as Category;

    if(!category) throw new NotFoundException("La categoria no existe");

    category.name = name;
    category.description = description;

    await category.save();

    return {
      statusCode: HttpStatus.OK,
      message: "Categoria actualizada correctamente",
      data: category
    };
  }

  async remove(id: number): Promise<ResponseData> {
  
    const category = (await this.findOne(id)).data as Category;

    if(!category) throw new NotFoundException("La categoria no existe");

    await category.destroy();

    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: "Categoria eliminada correctamente"
    };
  }
}
