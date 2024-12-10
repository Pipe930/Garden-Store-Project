import { IsEnum } from "class-validator";
import { OrderStatusEnum } from "src/core/enums/statusOrder.enum";

export class UpdatePurchaseDto {

    @IsEnum(OrderStatusEnum)
    readonly status: string;
}
