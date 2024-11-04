import { IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";


export class CreateTagDto {

    @IsString()
    @MaxLength(255)
    @IsNotEmpty()
    readonly name: string;

    @IsString()
    @IsOptional()
    readonly description: string;
}