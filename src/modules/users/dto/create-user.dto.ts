import { Transform, Type } from "class-transformer";
import { IsArray, IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";


export class CreateUserDto {

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
    readonly email: string;

    @IsBoolean()
    readonly active: boolean;

    @IsBoolean()
    readonly createdCart: boolean;

    @IsString()
    @MaxLength(255)
    @MinLength(8)
    @IsNotEmpty()
    @Transform(({value}) => value.trim())
    readonly password: string;

    @IsString()
    @MaxLength(255)
    @MinLength(8)
    @IsNotEmpty()
    @Transform(({value}) => value.trim())
    readonly rePassword: string;

    @IsString()
    @MaxLength(12)
    @MinLength(12)
    @IsNotEmpty()
    @Transform(({value}) => value.trim())
    @Matches(/^\+56\d{9}$/, { message: "El numero de telefono no es valido" })
    readonly phone: string;

    @IsOptional()
    @IsArray()
    @Type(() => RoleUser)
    readonly roles: RoleUser[];
}

export class RoleUser {

    @IsNumber()
    readonly idRole: string;

    @IsString()
    @IsNotEmpty()
    readonly name: string;
}
