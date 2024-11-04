import { IsEnum } from "class-validator";
import { ShippingStatusEnum } from "src/core/enums/statusShipping.enum";


export class UpdatePurchaseDto {

    @IsEnum(ShippingStatusEnum)
    readonly status: string;
}
