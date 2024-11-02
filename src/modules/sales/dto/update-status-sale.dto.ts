import { Type } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";
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

    @IsOptional()
    @Type(() => ShippingDto)
    readonly shipping: ShippingDto;
}

