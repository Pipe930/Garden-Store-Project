import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsNumber, IsPositive, IsString, IsUrl, Matches, Max, Min } from "class-validator";

export class CreateSupplierDto {

    @IsString()
    @IsNotEmpty()
    readonly fullName: string;

    @IsString()
    @IsNotEmpty()
    @Transform(({value}) => value.trim())
    @Matches(/^\d{8}-[\dkK]$/, { message: "El rut no es valido" })
    readonly rut: string;

    @IsString()
    @IsNotEmpty()
    @Transform(({value}) => value.trim())
    @Matches(/^\+569\d{8}$/, { message: "El numero de telefono no es valido" })
    readonly phone: string;

    @IsEmail()
    @IsNotEmpty()
    @Transform(({value}) => value.trim())
    readonly email: string;

    @IsNumber()
    // @IsPositive()
    readonly idAddress: number;
}
