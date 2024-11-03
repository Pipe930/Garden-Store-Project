import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, Length } from "class-validator";

export class ConfirmForgotPasswordDto {

    @IsString()
    @IsNotEmpty()
    readonly token: string;

    @IsString()
    @Length(2, 2)
    @IsNotEmpty()
    @Transform(({value}) => value.trim())
    readonly uuid: string;

    @IsString()
    @Length(8, 50)
    @IsNotEmpty()
    @Transform(({value}) => value.trim())
    readonly newPassword: string;

    @IsString()
    @Length(8, 50)
    @IsNotEmpty()
    @Transform(({value}) => value.trim())
    readonly newRePassword: string;
}