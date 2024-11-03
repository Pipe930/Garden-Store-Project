import { Body, Controller, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { AccessControlService } from './access-control.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { Auth } from 'src/core/decorators/auth.decorator';
import { ResourcesEnum } from 'src/core/enums/resourses.enum';
import { ActionsEnum } from 'src/core/enums/actions.enum';

@Controller('access-control')
export class AccessControlController {
  constructor(private readonly accessControlService: AccessControlService) {}

  @Get("roles")
  @Auth([{ resource: ResourcesEnum.ROLES, action: [ActionsEnum.READ] }])
  findAllRoles(){
    return this.accessControlService.findAllRoles();
  }

  @Post("roles")
  @Auth([{ resource: ResourcesEnum.ROLES, action: [ActionsEnum.CREATE] }])
  create(@Body() createRoleDto: CreateRoleDto){
    return this.accessControlService.createRole(createRoleDto);
  }

  @Get("roles/:id")
  @Auth([{ resource: ResourcesEnum.ROLES, action: [ActionsEnum.READ] }])
  findOne(@Param("id", ParseIntPipe) id: number){
    return this.accessControlService.findOneRole(id);
  }

  @Put("roles/:id")
  @Auth([{ resource: ResourcesEnum.ROLES, action: [ActionsEnum.UPDATE] }])
  update(@Param("id", ParseIntPipe) id: number,@Body() updateRoleDto: CreateRoleDto){
    return this.accessControlService.updateRole(id, updateRoleDto);
  }

  @Get("permissions")
  @Auth([{ resource: ResourcesEnum.PERMISSIONS, action: [ActionsEnum.READ] }])
  findAllPermissions(){
    return this.accessControlService.findAllPermissions();
  }

  @Post("permissions")
  @Auth([{ resource: ResourcesEnum.PERMISSIONS, action: [ActionsEnum.CREATE] }])
  createPermission(@Body() createPermissionDto: CreatePermissionDto){
    return this.accessControlService.createPermission(createPermissionDto);
  }

  @Get("permissions/:id")
  @Auth([{ resource: ResourcesEnum.PERMISSIONS, action: [ActionsEnum.READ] }])
  findOnePermission(@Param("id", ParseIntPipe) id: number){
    return this.accessControlService.findOnePermission(id);
  }

  @Put("permissions/:id")
  @Auth([{ resource: ResourcesEnum.PERMISSIONS, action: [ActionsEnum.UPDATE] }])
  updatePermission(@Param("id", ParseIntPipe) id: number, @Body() updatePermissionDto: CreatePermissionDto){
    return this.accessControlService.updatePermission(id, updatePermissionDto);
  }
}
