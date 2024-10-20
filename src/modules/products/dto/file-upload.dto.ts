import { IsBase64, IsEnum, IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

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

    @IsEnum(["cover", "gallery"])
    @IsNotEmpty()
    readonly type: string;

    @IsNumber()
    @IsPositive()
    readonly idProduct: number;
}