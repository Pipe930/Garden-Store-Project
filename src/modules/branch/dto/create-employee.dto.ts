import { Transform } from "class-transformer";
import { IsDate, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsString, Matches, MaxLength, Min, MinLength } from "class-validator";
import { GenderEnum } from "src/core/enums/gender.enum";

export class CreateEmployeeDto {

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(20)
    readonly firstName: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(20)
    readonly lastName: string;

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @MaxLength(255)
    readonly email: string;

    @IsString()
    @IsNotEmpty()
    @Transform(({value}) => value.trim())
    @Matches(/^\+56\d{9}$/, { message: "El numero de telefono no es valido" })
    @MinLength(12)
    @MaxLength(12)
    readonly phone: string;

    @IsEnum(GenderEnum)
    @IsNotEmpty()
    readonly gender: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(11)
    @MaxLength(12)
    readonly rut: string;

    @IsDate()
    @IsNotEmpty()
    readonly birthday: Date;

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