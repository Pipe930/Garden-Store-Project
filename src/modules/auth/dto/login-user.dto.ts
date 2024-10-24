import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";


export class LoginUserDto {

    @IsString()
    @IsEmail()
    @MaxLength(255)
    @IsNotEmpty()
    readonly email: string;

    @IsString()
    @MaxLength(50)
    @MinLength(6)
    @IsNotEmpty()
    @Transform(({value}) => value.trim())
    readonly password: string;
}