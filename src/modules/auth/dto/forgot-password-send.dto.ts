import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, MaxLength } from "class-validator";

export class SendForgotPasswordDto {

    @IsEmail()
    @IsNotEmpty()
    @MaxLength(255)
    @Transform(({value}) => value.trim())
    declare email: string;
}