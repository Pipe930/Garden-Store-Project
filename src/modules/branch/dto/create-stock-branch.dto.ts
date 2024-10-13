import { IsNumber, Min } from "class-validator";


export class CreateStockBranchDto {

    @IsNumber()
    readonly idBranch: number;

    @IsNumber()
    readonly idProduct: number;

    @IsNumber()
    @Min(1)
    readonly quantity: number;
}