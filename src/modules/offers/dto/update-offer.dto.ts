import { Transform } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, MinDate } from 'class-validator';

export class UpdateOfferDto {

    @IsString()
    @IsNotEmpty()
    readonly title: string;

    @IsDate()
    @Transform(({ value }) => new Date(value))
    @MinDate(new Date())
    @IsNotEmpty()
    readonly endDate: Date;

    @IsNumber()
    readonly discount: number;

    @IsString()
    @IsOptional()
    readonly description: string;
}
