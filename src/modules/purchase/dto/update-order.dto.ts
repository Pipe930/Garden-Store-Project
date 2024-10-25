import { IsEnum } from "class-validator";
import { StatusOrderEnum } from "src/core/enums/statusOrder.enum";

export class UpdateOrderDto {

    @IsEnum(StatusOrderEnum)
    readonly status: string;
}