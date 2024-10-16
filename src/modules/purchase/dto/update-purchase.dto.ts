import { IsEnum, IsNotEmpty } from "class-validator";
import { StatusPurchase } from "../models/purchase.model";


export class UpdatePurchaseDto {

    @IsEnum(StatusPurchase)
    @IsNotEmpty()
    readonly status: string;
}
