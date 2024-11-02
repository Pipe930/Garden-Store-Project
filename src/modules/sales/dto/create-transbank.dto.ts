import { IsNotEmpty, IsNumber, IsString, IsUrl, Min } from "class-validator";


export class CreateTransbankDto {

    @IsString()
    @IsNotEmpty()
    readonly buyOrder: string;

    @IsString()
    @IsNotEmpty()
    readonly sessionId: string;

    @IsNumber()
    @Min(1000)
    readonly amount: number;

    @IsString()
    @IsNotEmpty()
    readonly returnUrl: string;
}