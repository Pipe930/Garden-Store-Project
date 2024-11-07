import { IsEnum, IsNumber, IsPositive } from "class-validator";
import { ReactionsEnum } from "src/core/enums/reactions.enum";

export class CreateReactionDto {

    @IsEnum(ReactionsEnum)
    readonly reaction: string;

    @IsNumber()
    @IsPositive()
    readonly idPost: number;
}