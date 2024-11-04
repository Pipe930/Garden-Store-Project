import { IsEnum } from "class-validator";
import { ShippingStatusEnum } from "src/core/enums/statusShipping.enum";
export class UpdateOrderDto {

    @IsEnum(ShippingStatusEnum)
    readonly status: string;
}