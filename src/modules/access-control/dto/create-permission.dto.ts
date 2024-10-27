import { Transform } from "class-transformer";
import { IsArray, IsEnum, IsNotEmpty, IsString, MaxLength } from "class-validator";
import { ActionsEnum } from "src/core/enums/actions.enum";
import { ResourcesEnum } from "src/core/enums/resourses.enum";

export class CreatePermissionDto {

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    @Transform(({ value }) => value.toLowerCase())
    readonly name: string;

    @IsEnum(ResourcesEnum)
    readonly resource: string;

    @IsArray()
    @IsEnum(ActionsEnum, { each: true })
    readonly actions: ActionsEnum[];
}