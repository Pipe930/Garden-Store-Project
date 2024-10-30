import { IsNotEmpty, IsNumber, IsOptional, IsString, Matches, MaxLength } from "class-validator";


export class CreateAddressDto {

    @IsString()
    @IsNotEmpty()
    @Matches(/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+ \d+$/, { message: "La dirección no es válida" })
    declare addressName: string;

    @IsString()
    @IsOptional()
    @MaxLength(10)
    declare numDepartment: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(60)
    declare city: string;

    @IsString()
    @IsOptional()
    declare description: string;

    @IsNumber()
    @IsNotEmpty()
    declare idCommune: number;
}

export class CreateAddressUserDto extends CreateAddressDto {

    @IsString()
    @IsNotEmpty()
    declare name: string;
}