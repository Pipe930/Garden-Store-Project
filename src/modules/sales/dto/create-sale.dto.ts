import { IsEnum, IsNumber, IsOptional, IsPositive, Min } from "class-validator";
import { MethodPaymentEnum } from "src/core/enums/statusPurchase.enum";
import { WithdrawalEnum } from "src/core/enums/statusShipping.enum";

export class CreateSaleDto {

    @IsNumber()
    @Min(1000)
    readonly priceTotal: number;

    @IsNumber()
    @Min(0)
    readonly discountApplied: number;

    @IsNumber()
    @IsPositive()
    readonly productsQuantity: number;

    @IsEnum(WithdrawalEnum)
    readonly withdrawal: WithdrawalEnum;

    @IsNumber()
    @IsOptional()
    readonly idBranch: number;
}