import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsNumber, IsString, IsUrl, Matches, Max, Min } from "class-validator";

export class CreateSupplierDto {

    @IsString()
    @IsNotEmpty()
    readonly name: string;

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
    @Min(0.0)
    @Max(5.0)
    readonly rating: number;

    @IsString()
    @Transform(({value}) => value.trim())
    @IsUrl()
    readonly website: string;
}
