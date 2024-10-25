import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";
import { MethodPaymentEnum, StatusPurchaseEnum } from "src/core/enums/statusPurchase.enum";

interface listProductsPurchase {
    idProduct: number;
    quantity: number;
}

export class CreatePurchaseDto {

    @IsNumber()
    @Min(1)
    readonly quantityTotal: number;

    @IsNumber()
    @Min(1000)
    readonly totalPrice: number;

    @IsNumber()
    @Min(100)
    readonly ivaPrice: number;

    @IsOptional()
    @IsEnum(StatusPurchaseEnum)
    @IsNotEmpty()
    readonly status: string;

    @IsNumber()
    @Min(0)
    readonly discountsAplicated: number;

    @IsEnum(MethodPaymentEnum)
    readonly methodPayment: string;

    @IsString()
    @IsNotEmpty()
    readonly invoiveNumber: string;

    @IsNumber()
    readonly idSupplier: number;

    @IsNumber()
    readonly idEmployee: number;

    @IsArray()
    @IsNotEmpty()
    readonly listProducts: Array<listProductsPurchase>;
}
