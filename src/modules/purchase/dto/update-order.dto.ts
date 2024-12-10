import { IsEnum } from "class-validator";
import { OrderStatusEnum } from "src/core/enums/statusOrder.enum";
export class UpdateOrderDto {

    @IsEnum(OrderStatusEnum)
    readonly status: string;
}