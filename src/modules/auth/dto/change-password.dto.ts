import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";


export class ChangePasswordDto {

    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    @MinLength(8)
    readonly oldPassword: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    @MinLength(8)
    readonly newPassword: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    @MinLength(8)
    readonly newRePassword: string;
}