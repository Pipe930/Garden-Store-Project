import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, IsUUID, MaxLength, MinLength } from "class-validator";


export class ActivationAccountDto {

    @IsUUID()
    @IsNotEmpty()
    declare token: string;

    @IsString()
    @MinLength(2)
    @MaxLength(2)
    @IsNotEmpty()
    @Transform(({value}) => value.trim())
    declare uuid: string;
}