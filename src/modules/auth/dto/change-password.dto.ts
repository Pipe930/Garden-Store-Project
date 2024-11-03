import { IsNotEmpty, IsString, Length } from "class-validator";


export class ChangePasswordDto {

    @IsNotEmpty()
    @IsString()
    @Length(8, 50)
    readonly oldPassword: string;

    @IsNotEmpty()
    @IsString()
    @Length(8, 50)
    readonly newPassword: string;

    @IsNotEmpty()
    @IsString()
    @Length(8, 50)
    readonly newRePassword: string;
}