import { IsNotEmpty, IsNumber } from "class-validator";

export class SubstractItemCartDto {

    @IsNumber()
    @IsNotEmpty()
    idProduct: number;
}