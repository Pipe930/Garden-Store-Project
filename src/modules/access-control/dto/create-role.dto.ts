import { Transform, Type } from 'class-transformer';
import { IsString, IsNotEmpty, ValidateNested, IsEnum, IsArray, IsOptional } from 'class-validator';
import { ActionsEnum } from 'src/core/enums/actions.enum';
import { ResourcesEnum } from 'src/core/enums/resourses.enum';

export class CreateRoleDto {

    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value.toLowerCase())
    readonly name: string;

    @IsOptional()
    @IsArray()
    @Type(() => Permission)
    readonly permissions: Permission[];
}

export class Permission {

    @IsEnum(ResourcesEnum)
    readonly resource: ResourcesEnum;

    @IsEnum(ActionsEnum, { each: true })
    readonly action: ActionsEnum[];
}