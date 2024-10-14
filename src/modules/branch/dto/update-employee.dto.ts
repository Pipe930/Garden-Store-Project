import { IsDate, IsEmail, IsNotEmpty, IsNumber, IsString, MaxLength, Min, MinLength } from "class-validator";


export class UpdateEmployeeDto {

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @MaxLength(255)
    readonly email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(12)
    @MaxLength(12)
    readonly phone: string;

    @IsDate()
    @IsNotEmpty()
    readonly dateContract: Date;

    @IsNumber()
    @Min(150000)
    readonly salary: number;

    @IsString()
    @IsNotEmpty()
    readonly condition: string;

    @IsNumber()
    readonly idBranch: number;
}