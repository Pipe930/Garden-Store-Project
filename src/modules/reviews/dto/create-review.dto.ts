import { IsDecimal, IsNotEmpty, IsNumber, IsPositive, IsString, Max, Min } from "class-validator";


export class CreateReviewDto {

    @IsString()
    @IsNotEmpty()
    readonly title: string;

    @IsString()
    @IsNotEmpty()
    readonly content: string;

    @IsNumber()
    @Min(1)
    @Max(5)
    readonly rating: number;

    @IsNumber()
    @IsPositive()
    readonly idProduct: number;
}
