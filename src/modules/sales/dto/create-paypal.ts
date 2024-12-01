import { IsNotEmpty, IsNumber, IsString, Min } from "class-validator";

export class CreatePaypalDto {

    @IsNumber()
    @Min(1000)
    readonly amount: number;
}

export class CommitPaypalDto {

    @IsString()
    @IsNotEmpty()
    token: string;

    @IsString()
    @IsNotEmpty()
    PayerID: string;
}