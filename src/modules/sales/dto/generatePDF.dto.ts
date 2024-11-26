import { IsNotEmpty, IsNumber, IsPositive, IsUUID, Max, Min } from "class-validator";

export class GeneratePDFDto {

    @IsUUID()
    @IsNotEmpty()
    idSale: string;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    timeAnalytics: number;

    @IsNumber()
    @Min(0)
    @Max(1)
    result: number;
}