import { IsEnum, IsNotEmpty, IsNumber, IsPositive, IsString, Min } from "class-validator";
import { ShippingStatusEnum } from "src/core/enums/statusShipping.enum";

export class UpdateShippingDto {

    @IsNotEmpty()
    @IsEnum(ShippingStatusEnum)
    readonly status: string;

    @IsNotEmpty()
    @IsString()
    informationShipping: string;

    @IsNumber()
    @Min(0)
    shippingCost: number;
}
