import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class ActivationAccountDto {

    @IsString()
    @IsNotEmpty()
    readonly token: string;

    @IsString()
    @MinLength(2)
    @MaxLength(2)
    @IsNotEmpty()
    @Transform(({value}) => value.trim())
    readonly uuid: string;
}