import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateUserDto extends PartialType(CreateUserDto) {

    @IsString()
    @IsOptional()
    readonly firstName: string;

    @IsString()
    @IsOptional()
    readonly lastName: string;

    @IsString()
    @IsEmail()
    @IsNotEmpty()
    readonly email: string;

    @IsBoolean()
    readonly active: boolean;

    @IsString()
    @MaxLength(12)
    @MinLength(12)
    @IsNotEmpty()
    @Transform(({value}) => value.trim())
    @Matches(/^\+56\d{9}$/, { message: "El numero de telefono no es valido" })
    readonly phone: string;
}
