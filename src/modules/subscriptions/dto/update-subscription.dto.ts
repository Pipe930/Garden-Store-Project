import { IsNumber, Min } from "class-validator";

export class UpdateSubscriptionDto {

    @IsNumber()
    @Min(1000)
    readonly mount: number;
}
