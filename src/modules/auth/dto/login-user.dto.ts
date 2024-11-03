import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString, Length, MaxLength } from "class-validator";


export class LoginUserDto {

    @IsString()
    @IsEmail()
    @MaxLength(255)
    @IsNotEmpty()
    readonly email: string;

    @IsString()
    @Length(8, 50)
    @IsNotEmpty()
    @Transform(({value}) => value.trim())
    readonly password: string;
}