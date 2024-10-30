import { Type } from "class-transformer";
import { IsArray, IsNumber, Min } from "class-validator";


export class CreateStockBranchDto {

    @IsNumber()
    readonly idBranch: number;

    @IsArray()
    @Type(() => ProductBranch)
    readonly products: ProductBranch[];
}

class ProductBranch {

    readonly idProduct: number;

    readonly title: string;

    readonly quantity: number;
}