import { IsString, IsNotEmpty, IsOptional, MaxLength, IsEmpty } from 'class-validator';

export class CreateCategoryDto {

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    declare name: string;
    
    @IsString()
    @IsOptional()
    declare description: string;
}
