import { IsEnum, IsNotEmpty } from "class-validator";
import { StatusSaleEnum } from "src/core/enums/statusSale.enum";


export class UpdateSaleDto {

    @IsEnum(StatusSaleEnum)
    readonly status: string;
}
