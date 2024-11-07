import { Type } from "class-transformer";
import { IsArray, IsBase64, IsBoolean, IsNotEmpty, IsNumber, IsPositive, IsString, MaxLength } from "class-validator";

export class CreatePostUserDto {

    @IsString()
    @MaxLength(255)
    @IsNotEmpty()
    readonly title: string;

    @IsString()
    @MaxLength(255)
    @IsNotEmpty()
    readonly subtitle: string;

    @IsString()
    @IsNotEmpty()
    readonly content: string;

    @IsBase64()
    @IsNotEmpty()
    readonly file: string;

    @IsString()
    @IsNotEmpty()
    readonly filename: string;

    @IsString()
    @IsNotEmpty()
    readonly typeFormat: string;

    @IsBoolean()
    readonly published: boolean;

    @IsArray()
    @Type (() => TagsList)
    readonly tags: TagsList[];
}

export class CreatePostDto extends CreatePostUserDto {

    @IsNumber()
    readonly idUser: number;
}

export class TagsList {

    @IsNumber()
    @IsPositive()
    readonly idTag: number;

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    readonly name: string;
}


