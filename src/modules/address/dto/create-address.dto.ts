import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";


export class CreateAddressDto {

    @IsString()
    @IsNotEmpty()
    declare name: string;

    @IsString()
    @IsNotEmpty()
    declare addressName: string;

    @IsString()
    @IsOptional()
    declare numDepartment: string;

    @IsString()
    @IsNotEmpty()
    declare city: string;

    @IsString()
    @IsOptional()
    declare description: string;

    @IsNumber()
    @IsNotEmpty()
    declare idCommune: number;
}