import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";
import { MethodPayment, StatusPurchase } from "../models/purchase.model";


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
    @IsEnum(StatusPurchase)
    @IsNotEmpty()
    readonly status: string;

    @IsNumber()
    @Min(0)
    readonly discountsAplicated: number;

    @IsEnum(MethodPayment)
    @IsNotEmpty()
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
