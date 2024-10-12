import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateOfferDto {

    @IsString()
    @IsNotEmpty()
    readonly title: string;

    @IsDate()
    @IsNotEmpty()
    readonly endDate: Date;

    @IsNumber()
    readonly discount: number;

    @IsString()
    @IsOptional()
    readonly description: string;
}
