import { IsEnum, IsNotEmpty } from "class-validator";
import { ShippingStatus } from "../models/shipping.model";

export class UpdateShippingDto{

    @IsNotEmpty()
    @IsEnum([ShippingStatus.PREPARING, ShippingStatus.SHIPPED, ShippingStatus.DELIVERED, ShippingStatus.PENDING])
    readonly status: string;
}
