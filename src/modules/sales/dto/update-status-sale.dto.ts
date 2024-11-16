import { Type } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";
import { MethodPaymentEnum } from "src/core/enums/statusPurchase.enum";
import { StatusSaleEnum } from "src/core/enums/statusSale.enum";

class ShippingDto {

    @IsString()
    @IsNotEmpty()
    readonly informationShipping: string;

    @IsNumber()
    @IsPositive()
    readonly shippingCost: string;

    @IsNumber()
    readonly idAddress: number;
}

export class UpdateSaleDto {

    @IsEnum(StatusSaleEnum)
    readonly status: string;

    @IsEnum(MethodPaymentEnum)
    readonly methodPayment: MethodPaymentEnum;

    @IsOptional()
    @Type(() => ShippingDto)
    readonly shipping: ShippingDto;
}

