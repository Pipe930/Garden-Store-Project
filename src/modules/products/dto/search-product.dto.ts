import { Transform } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";


export class SearchProductDto {

    @IsString()
    @IsOptional()
    title: string;

    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    @IsOptional()
    category: number;
}