import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { TypeWithdrawal } from "../models/shipping.model";


export class CreateShippingDto {

    @IsNotEmpty()
    @IsString()
    informationShipping: string;

    @IsNumber()
    shippingCost: number;

    @IsEnum([TypeWithdrawal.DELIVERY, TypeWithdrawal.IN_STORE])
    @IsNotEmpty()
    withdrawal: string;

    @IsNumber()
    idAddress: number;
}
