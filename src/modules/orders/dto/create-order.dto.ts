import { IsNotEmpty, IsNumber, IsPositive, IsString, Min } from "class-validator";

export class CreateOrderDto {

    @IsNotEmpty()
    @IsString()
    readonly informationShipping: string;

    @IsNumber()
    @Min(0)
    readonly shippingCost: number;
}