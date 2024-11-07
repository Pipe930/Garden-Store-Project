import { IsString } from "class-validator";

export class SearchPostDto {

    @IsString()
    readonly title: string;
}