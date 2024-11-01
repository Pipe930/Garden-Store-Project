import { IsNumber, Min } from "class-validator";

export class CreateSubscriptionDto {

    @IsNumber()
    @Min(1000)
    readonly mount: number;
}
