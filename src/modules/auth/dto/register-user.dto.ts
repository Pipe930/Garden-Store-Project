import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";


export class RegisterUserDto {

    @IsString()
    @IsOptional()
    readonly first_name?: string;

    @IsString()
    @IsOptional()
    readonly last_name?: string;

    @IsString()
    @IsEmail()
    @MaxLength(255)
    @IsNotEmpty()
    readonly email: string;

    @IsString()
    @MaxLength(50)
    @MinLength(8)
    @IsNotEmpty()
    @Transform(({value}) => value.trim())
    readonly password: string;

    @IsString()
    @MaxLength(50)
    @MinLength(8)
    @IsNotEmpty()
    @Transform(({value}) => value.trim())
    readonly re_password: string;

    @IsString()
    @MaxLength(12)
    @MinLength(12)
    @IsNotEmpty()
    @Transform(({value}) => value.trim())
    @Matches(/^\+56\d{9}$/, { message: "El numero de telefono no es valido" })
    readonly phone: string;
}