import { IsNumber, IsPositive } from "class-validator";


export class ResendOTPDto {

    @IsNumber()
    @IsPositive()
    readonly idUser: number;
}