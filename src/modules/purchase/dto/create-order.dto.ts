import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsString, IsUUID, Min } from "class-validator";
import { TypeStatusOrder } from "../models/purchase-order.model";


export class CreateOrderDto {

    @IsUUID()
    @IsNotEmpty()
    readonly idPurchaseOrder: string;

    @IsEnum(TypeStatusOrder)
    @IsNotEmpty()
    readonly status: string;

    @IsDate()
    @IsNotEmpty()
    readonly dateDelivery: Date;

    @IsNumber()
    @Min(0)
    readonly shippingCost: number;

    @IsNotEmpty()
    @IsString()
    readonly addressShipping: string;

    @IsNumber()
    readonly idBranch: number;
}