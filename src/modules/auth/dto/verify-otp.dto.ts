import { IsNotEmpty, IsNumber, IsPositive, IsString, MaxLength, MinLength } from "class-validator";


export class VerifyOtpDto {

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(6)
    readonly otp: string;

    @IsNumber()
    @IsPositive()
    readonly idUser: number;
}