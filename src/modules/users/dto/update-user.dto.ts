import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateUserDto extends PartialType(CreateUserDto) {

    @IsString()
    declare first_name?: string;

    @IsString()
    declare last_name?: string;

    @IsString()
    @MaxLength(12)
    @MinLength(12)
    @IsNotEmpty()
    @Transform(({value}) => value.trim())
    @Matches(/^\+56\d{9}$/, { message: "El numero de telefono no es valido" })
    declare phone: string;
}
