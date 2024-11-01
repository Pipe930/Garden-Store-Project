import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsPositive, IsString, Min } from "class-validator";


export class CreateStockBranchDto {

    @IsNumber()
    readonly idBranch: number;

    @IsArray()
    @Type(() => ProductBranch)
    readonly products: ProductBranch[];
}

class ProductBranch {

    @IsNumber()
    readonly idProduct: number;

    @IsString()
    @IsNotEmpty()
    readonly title: string;

    @IsNumber()
    @Min(1)
    @IsPositive()
    readonly quantity: number;
}