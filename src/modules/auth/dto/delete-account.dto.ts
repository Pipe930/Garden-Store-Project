import { IsNotEmpty, IsString, Length } from "class-validator";


export class DeleteAccountDto {
    @IsNotEmpty()
    @IsString()
    @Length(8, 20)
    password: string;
}