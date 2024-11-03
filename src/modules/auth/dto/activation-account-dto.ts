import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, Length } from "class-validator";

export class ActivationAccountDto {

    @IsString()
    @IsNotEmpty()
    readonly token: string;

    @IsString()
    @Length(2, 2)
    @IsNotEmpty()
    @Transform(({value}) => value.trim())
    readonly uuid: string;
}