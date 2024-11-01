import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { CreateCategoryDto } from './create-category.dto';

export class UpdateCategoryDto extends CreateCategoryDto {}
