import { Type } from "class-transformer";
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Min } from "class-validator";
import { MethodPaymentEnum } from "src/core/enums/statusPurchase.enum";
import { StatusSaleEnum } from "src/core/enums/statusSale.enum";

export class CreatePurchaseDto {

    @IsNumber()
    @Min(1)
    readonly quantityTotal: number;

    @IsNumber()
    @Min(1000)
    readonly totalPrice: number;

    @IsOptional()
    @IsEnum(StatusSaleEnum)
    @IsNotEmpty()
    readonly status: string;

    @IsNumber()
    @Min(0)
    readonly discountsAplicated: number;

    @IsEnum(MethodPaymentEnum)
    readonly methodPayment: string;

    @IsString()
    @IsNotEmpty()
    readonly invoiceNumber: string;

    @IsNumber()
    readonly idSupplier: number;

    @IsNumber()
    readonly idEmployee: number;

    @IsArray()
    @Type(() => ListProductsPurchase)
    readonly products: ListProductsPurchase[];
}

export class ListProductsPurchase {

    @IsNumber()
    @IsPositive()
    readonly idProduct: number;

    @IsNumber()
    @IsPositive()
    readonly quantity: number;
}