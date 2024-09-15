import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";


export class CreateUserDto {

    @IsString()
    declare first_name?: string;

    @IsString()
    declare last_name?: string;

    @IsString()
    @IsEmail()
    @MaxLength(255)
    @IsNotEmpty()
    declare email: string;

    @IsString()
    @MaxLength(255)
    @MinLength(8)
    @IsNotEmpty()
    @Transform(({value}) => value.trim())
    declare password: string;

    @IsString()
    @MaxLength(255)
    @MinLength(8)
    @IsNotEmpty()
    @Transform(({value}) => value.trim())
    declare re_password: string;

    @IsString()
    @MaxLength(12)
    @MinLength(12)
    @IsNotEmpty()
    @Transform(({value}) => value.trim())
    @Matches(/^\+56\d{9}$/, { message: "El numero de telefono no es valido" })
    declare phone: string;
}
