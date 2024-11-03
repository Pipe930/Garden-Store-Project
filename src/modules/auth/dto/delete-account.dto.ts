import { IsNotEmpty, IsString, Length } from "class-validator";


export class DeleteAccountDto {

    @IsNotEmpty()
    @IsString()
    @Length(8, 50)
    password: string;
}