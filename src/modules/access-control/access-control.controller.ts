import { Body, Controller, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { AccessControlService } from './access-control.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { CreatePermissionDto } from './dto/create-permission.dto';

@Controller('access-control')
export class AccessControlController {
  constructor(private readonly accessControlService: AccessControlService) {}

  @Get("roles")
  findAllRoles(){
    return this.accessControlService.findAllRoles();
  }

  @Post("roles")
  create(@Body() createRoleDto: CreateRoleDto){
    return this.accessControlService.createRole(createRoleDto);
  }

  @Get("roles/:id")
  findOne(@Param("id", ParseIntPipe) id: number){
    return this.accessControlService.findOneRole(id);
  }

  @Put("roles/:id")
  update(@Param("id", ParseIntPipe) id: number,@Body() updateRoleDto: CreateRoleDto){
    return this.accessControlService.updateRole(id, updateRoleDto);
  }

  @Get("permissions")
  findAllPermissions(){
    return this.accessControlService.findAllPermissions();
  }

  @Post("permissions")
  createPermission(@Body() createPermissionDto: CreatePermissionDto){
    return this.accessControlService.createPermission(createPermissionDto);
  }

  @Get("permissions/:id")
  findOnePermission(@Param("id", ParseIntPipe) id: number){
    return this.accessControlService.findOnePermission(id);
  }

  @Put("permissions/:id")
  updatePermission(@Param("id", ParseIntPipe) id: number, @Body() updatePermissionDto: CreatePermissionDto){
    return this.accessControlService.updatePermission(id, updatePermissionDto);
  }
}
