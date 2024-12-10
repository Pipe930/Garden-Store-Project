import { Type } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";
import { WithdrawalEnum } from "src/core/enums/statusOrder.enum";
import { MethodPaymentEnum } from "src/core/enums/statusPurchase.enum";
import { StatusSaleEnum } from "src/core/enums/statusSale.enum";

class CreateOrderDto {

    @IsNotEmpty()
    @IsString()
    readonly informationShipping: string;

    @IsEnum(WithdrawalEnum)
    readonly withdrawal: WithdrawalEnum;

    @IsNumber()
    @IsPositive()
    readonly shippingCost: number;

    @IsNumber()
    @IsOptional()
    readonly idAddress?: number;
}

export class UpdateSaleDto {

    @IsEnum(StatusSaleEnum)
    readonly status: string;

    @IsEnum(MethodPaymentEnum)
    readonly methodPayment: MethodPaymentEnum;

    @IsNotEmpty()
    @Type(() => CreateOrderDto)
    readonly shipping: CreateOrderDto;
}

