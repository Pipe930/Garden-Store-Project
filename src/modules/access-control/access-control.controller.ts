import { Body, Controller, Get, HttpCode, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { AccessControlService } from './access-control.service';
import { CreateRoleDto } from './dto/create-role.dto';

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

  @Put("roles/:id")
  update(@Param("id", ParseIntPipe) id: number,@Body() updateRoleDto: CreateRoleDto){
    return this.accessControlService.updateRole(id, updateRoleDto);
  }
}
