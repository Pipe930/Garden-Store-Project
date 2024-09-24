import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateRoleDto {

    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsString()
    @IsOptional()
    readonly description?: string;
}