import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";


export class RegisterUserDto {

    @IsString()
    @IsOptional()
    readonly firstName?: string;

    @IsString()
    @IsOptional()
    readonly lastName?: string;

    @IsString()
    @IsEmail()
    @MaxLength(255)
    @IsNotEmpty()
    @Transform(({value}) => value.trim())
    readonly email: string;

    @IsString()
    @MaxLength(50)
    @MinLength(6)
    @IsNotEmpty()
    @Transform(({value}) => value.trim())
    readonly password: string;

    @IsString()
    @MaxLength(50)
    @MinLength(6)
    @IsNotEmpty()
    @Transform(({value}) => value.trim())
    readonly rePassword: string;

    @IsString()
    @IsNotEmpty()
    @Transform(({value}) => value.trim())
    @Matches(/^\+569\d{8}$/, { message: "El numero de telefono no es valido" })
    readonly phone: string;
}