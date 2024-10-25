import { IsNumber, IsPositive, Min } from "class-validator";


export class CreateSaleDto {

    @IsNumber()
    @Min(1000)
    declare priceTotal: number;

    @IsNumber()
    @Min(0)
    declare discountApplied: number;

    @IsNumber()
    @IsPositive()
    declare productsQuantity: number;
}