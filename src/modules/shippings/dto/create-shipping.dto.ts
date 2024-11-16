import { IsEnum, IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";
import { WithdrawalEnum } from "src/core/enums/statusShipping.enum";


export class CreateShippingDto {

    @IsNotEmpty()
    @IsString()
    informationShipping: string;

    @IsNumber()
    @IsPositive()
    shippingCost: number;

    @IsNumber()
    idAddress: number;
}
