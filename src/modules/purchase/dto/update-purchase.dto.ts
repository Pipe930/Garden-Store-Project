import { IsEnum, IsNotEmpty } from "class-validator";
import { StatusPurchaseEnum } from "src/core/enums/statusPurchase.enum";


export class UpdatePurchaseDto {

    @IsEnum(StatusPurchaseEnum)
    readonly status: string;
}
