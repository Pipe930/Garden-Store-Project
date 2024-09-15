import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";


export class LoginUserDto {

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
}