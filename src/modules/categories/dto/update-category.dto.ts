import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateCategoryDto {

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    declare name: string;

    @IsString()
    @IsOptional()
    declare description: string;
}
