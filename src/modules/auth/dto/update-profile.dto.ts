import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches } from "class-validator";


export class UpdateProfileDto {

    @IsString()
    @IsOptional()
    readonly firstName: string;

    @IsString()
    @IsOptional()
    readonly lastName: string;

    @IsEmail()
    @IsNotEmpty()
    @Transform(({value}) => value.trim())
    readonly email: string;

    @IsString()
    @IsNotEmpty()
    @Transform(({value}) => value.trim())
    @Matches(/^\+569\d{8}$/, { message: "El numero de telefono no es valido" })
    readonly phone: string;
}