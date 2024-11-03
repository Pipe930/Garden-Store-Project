import { Controller, Get, Post, Body, Param, ParseIntPipe, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Auth } from 'src/core/decorators/auth.decorator';
import { ResourcesEnum } from 'src/core/enums/resourses.enum';
import { ActionsEnum } from 'src/core/enums/actions.enum';

@Controller('users')
export class UsersController {
  
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Auth([{ resource: ResourcesEnum.USERS, action: [ActionsEnum.CREATE] }])
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Auth([{ resource: ResourcesEnum.USERS, action: [ActionsEnum.READ] }])
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Auth([{ resource: ResourcesEnum.USERS, action: [ActionsEnum.READ] }])
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  @Auth([{ resource: ResourcesEnum.USERS, action: [ActionsEnum.UPDATE] }])
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(id, updateUserDto);
  }
}
