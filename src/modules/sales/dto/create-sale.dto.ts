import { IsNumber, IsOptional, IsPositive, Min } from "class-validator";

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

    @IsNumber()
    @IsOptional()
    readonly idBranch: number;
}

export class SaleAnalytics {
    
    readonly transaction_amount: number;
    readonly payment_method: number;
    readonly quantity: number;
    readonly customer_age: number;
    readonly account_age_days: number;
    readonly transaction_hour: number;
    readonly product_category: number;
    readonly device_used_desktop: number;
    readonly device_used_mobile: number;
    readonly device_used_tablet: number;
}