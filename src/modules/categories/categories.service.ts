import { BadRequestException, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './models/category.model';
import { ResponseData } from 'src/core/interfaces/response-data.interface';
import { Op } from 'sequelize';

@Injectable()
export class CategoriesService {

  async create(createCategoryDto: CreateCategoryDto): Promise<ResponseData> {

    const { name, description } = createCategoryDto;

    const category = await Category.findOne<Category>({ where: { name: { [Op.iLike]: name } } });

    if(category) throw new NotFoundException("El nombre de la categoria ya existe");

    try {    
      const newCategory = await Category.create<Category>({ name, slug: "a", description });
      return {
        statusCode: HttpStatus.CREATED,
        message: "Categoria creada correctamente",
        data: newCategory
      };
    } catch (error) {

      throw new BadRequestException("No se creo la categoria correctamente");
      
    }

  }

  async findAll(): Promise<ResponseData> {

    const categories = await Category.findAll<Category>();

    if(categories.length === 0) return { message: "No tenemos usuarios registrados", statusCode: HttpStatus.NO_CONTENT }

    return {
      statusCode: HttpStatus.OK,
      data: categories
    };
  }

  async findOne(id: number): Promise<ResponseData> {

    const category = await Category.findByPk<Category>(id);

    if(!category) throw new NotFoundException("La categoria no existe");

    return {
      statusCode: HttpStatus.OK,
      message: "Categoria encontrada con exito",
      data: category
    };
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<ResponseData> {

    const { name, description } = updateCategoryDto;

    const category = await Category.findByPk<Category>(id);

    if(!category) throw new NotFoundException("La categoria no existe");

    try {
      
      category.name = name;
      category.description = description;
  
      await category.save();
    } catch (error) {
      throw new BadRequestException("No se actualizo la categoria correctamente");
    }

    return {
      statusCode: HttpStatus.OK,
      message: "Categoria actualizada correctamente",
      data: category
    };
  }

  async remove(id: number): Promise<ResponseData> {
  
    const category = await Category.findByPk<Category>(id);

    if(!category) throw new NotFoundException("La categoria no existe");

    await category.destroy();

    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: "Categoria eliminada correctamente"
    };
  }
}
