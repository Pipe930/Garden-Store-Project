import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, IsUUID, MaxLength, MinLength } from "class-validator";

export class ConfirmForgotPasswordDto {

    @IsString()
    @IsNotEmpty()
    declare token: string;

    @IsString()
    @MinLength(2)
    @MaxLength(2)
    @IsNotEmpty()
    @Transform(({value}) => value.trim())
    declare uuid: string;

    @IsString()
    @MinLength(8)
    @MaxLength(255)
    @IsNotEmpty()
    @Transform(({value}) => value.trim())
    declare password: string;

    @IsString()
    @MinLength(8)
    @MaxLength(255)
    @IsNotEmpty()
    @Transform(({value}) => value.trim())
    declare rePassword: string;
}