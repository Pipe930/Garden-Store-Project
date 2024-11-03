import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto, RoleUser } from './create-user.dto';
import { IsArray, IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { Transform, Type } from 'class-transformer';

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
    @IsNotEmpty()
    @Transform(({value}) => value.trim())
    @Matches(/^\+569\d{8}$/, { message: "El numero de telefono no es valido" })
    readonly phone: string;

    @IsOptional()
    @IsArray()
    @Type(() => RoleUser)
    readonly roles: RoleUser[];
}
