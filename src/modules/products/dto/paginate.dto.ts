import { Transform } from "class-transformer";
import { IsNumber, IsOptional } from "class-validator";


export class PaginateDto {

    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    @IsOptional()
    page: number;

    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    @IsOptional()
    limit: number;
}