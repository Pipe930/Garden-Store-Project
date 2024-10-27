import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsEnum, IsArray, IsOptional, MaxLength, IsNumber } from 'class-validator';
import { ActionsEnum } from 'src/core/enums/actions.enum';
import { ResourcesEnum } from 'src/core/enums/resourses.enum';

export class CreateRoleDto {

    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsOptional()
    @IsArray()
    @Type(() => PermissionCreate)
    readonly permissions: PermissionCreate[];
}

export class Permission {

    @IsEnum(ResourcesEnum)
    readonly resource: ResourcesEnum;

    @IsEnum(ActionsEnum, { each: true })
    readonly action: ActionsEnum[];
}

export class PermissionCreate {

    @IsNumber()
    readonly idPermission: number;

    @IsString()
    @IsNotEmpty()
    @MaxLength(40)
    readonly name: string;
}