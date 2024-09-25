import { IsBase64, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min } from "class-validator";

export class CreateProductDto {

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    readonly title: string;

    @IsNumber()
    @IsNotEmpty()
    @Min(100)
    readonly price: number;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    readonly brand: string;

    @IsString()
    @IsNotEmpty()
    readonly returnPolicy: string;

    @IsString()
    @IsOptional()
    readonly description: string;

    @IsNumber()
    @IsNotEmpty()
    readonly idCategory: number;
}
