import { Transform } from "class-transformer";
import { IsDate, IsEmail, IsNotEmpty, IsNumber, IsPositive, IsString, Matches, MaxLength, Min, MinLength } from "class-validator";


export class CreateBranchDto {

    @IsString()
    @IsNotEmpty()
    declare name: string;

    @IsString()
    @IsNotEmpty()
    declare tradeName: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(7)
    @MaxLength(7)
    declare postalCode: string;

    @IsString()
    @IsEmail()
    @IsNotEmpty()
    @Transform(({value}) => value.trim())
    declare email: string;

    @IsString()
    @IsNotEmpty()
    @Transform(({value}) => value.trim())
    @Matches(/^\+56\d{9}$/, { message: "El numero de telefono no es valido" })
    declare phone: string;

    @IsDate()
    @Transform(({ value }) => new Date(value))
    declare openingDate: Date;

    @Min(100)
    @IsNumber()
    declare capacity: number;

    @IsNumber()
    @IsPositive()
    declare idAddress: number;
}