import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

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
    @MinLength(6)
    @MaxLength(50)
    @IsNotEmpty()
    @Transform(({value}) => value.trim())
    readonly newPassword: string;

    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @IsNotEmpty()
    @Transform(({value}) => value.trim())
    readonly newRePassword: string;
}