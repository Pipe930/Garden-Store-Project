import { IsNumber, Min } from "class-validator";


export class CreateTransbankDto {

    @IsNumber()
    @Min(1000)
    readonly amount: number;
}