import { IsBase64, IsEnum, IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";
import { TypeImagesEnum } from "src/core/enums/typeImages.enum";

export class FileUploadDto {

    @IsBase64()
    @IsNotEmpty()
    readonly file: string;

    @IsString()
    @IsNotEmpty()
    readonly filename: string;

    @IsString()
    @IsNotEmpty()
    readonly typeFormat: string;

    @IsEnum(TypeImagesEnum)
    readonly type: string;

    @IsNumber()
    @IsPositive()
    readonly idProduct: number;
}