import { IsEnum, IsNotEmpty } from "class-validator";
import { TypeStatus } from "../models/sale.model";


export class UpdateSaleDto {

    @IsEnum([TypeStatus.PAID, TypeStatus.CANCELED, TypeStatus.PENDING])
    @IsNotEmpty()
    readonly status: string;
}
