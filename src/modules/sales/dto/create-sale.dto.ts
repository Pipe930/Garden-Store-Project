import { IsEnum, IsNotEmpty, IsNumber, Min } from "class-validator";
import { SaleWithdrawal } from "../models/sale.model";


export class CreateSaleDto {

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    declare priceTotal: number;

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    declare discountApplied: number;

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    declare productsQuantity: number;

    @IsEnum(SaleWithdrawal)
    @IsNotEmpty()
    declare withdrawal: string;
}