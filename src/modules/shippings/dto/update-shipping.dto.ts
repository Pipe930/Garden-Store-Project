import { IsEnum, IsNotEmpty } from "class-validator";
import { ShippingStatusEnum } from "src/core/enums/statusShipping.enum";

export class UpdateShippingDto {

    @IsNotEmpty()
    @IsEnum(ShippingStatusEnum)
    readonly status: string;
}
