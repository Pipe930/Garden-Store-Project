import { IsNotEmpty, IsNumber, IsPositive, IsString, MaxLength } from "class-validator";

export class CreateCommentDto {

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    declare comment: string;

    @IsNumber()
    @IsPositive()
    declare idPost: number;
}
