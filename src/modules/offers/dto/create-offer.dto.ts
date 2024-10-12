import { Transform } from "class-transformer";
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min, MinDate } from "class-validator";


export class CreateOfferDto {

    @IsString()
    @IsNotEmpty()
    readonly title: string;

    @IsDate()
    @Transform(({ value }) => new Date(value))
    @MinDate(new Date())
    @IsNotEmpty()
    readonly endDate: Date;

    @IsNumber()
    @Min(1)
    @Max(100)
    readonly discount: number;

    @IsString()
    @IsOptional()
    readonly description: string;
}
