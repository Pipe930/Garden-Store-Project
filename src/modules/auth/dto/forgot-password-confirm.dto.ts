import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, IsUUID, MaxLength, MinLength } from "class-validator";

export class ConfirmForgotPasswordDto {

    @IsString()
    @IsNotEmpty()
    readonly token: string;

    @IsString()
    @MinLength(2)
    @MaxLength(2)
    @IsNotEmpty()
    @Transform(({value}) => value.trim())
    readonly uuid: string;

    @IsString()
    @MinLength(8)
    @MaxLength(255)
    @IsNotEmpty()
    @Transform(({value}) => value.trim())
    readonly password: string;

    @IsString()
    @MinLength(8)
    @MaxLength(255)
    @IsNotEmpty()
    @Transform(({value}) => value.trim())
    readonly rePassword: string;
}