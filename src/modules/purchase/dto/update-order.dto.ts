import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { TypeStatusOrder } from "../models/purchase-order.model";

export class UpdateOrderDto {

    @IsEnum(TypeStatusOrder)
    @IsNotEmpty()
    readonly status: string;
}