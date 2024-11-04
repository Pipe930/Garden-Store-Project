import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";

export class CreatePostUserDto {

    @IsString()
    @MaxLength(255)
    @IsNotEmpty()
    readonly title: string;

    @IsString()
    @IsNotEmpty()
    readonly body: string;

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
    readonly idTag: number;

    @IsString()
    @IsNotEmpty()
    readonly slug: string;
}


