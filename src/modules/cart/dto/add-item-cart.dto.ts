import { IsNotEmpty, IsNumber, Min } from "class-validator";

export class AddItemCartDto {

    @IsNumber()
    @IsNotEmpty()
    idProduct: number;

    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    quantity: number;
}