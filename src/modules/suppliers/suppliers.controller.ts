import { Controller, Get, Post, Body, Param, ParseIntPipe, Put } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { ResourcesEnum } from 'src/core/enums/resourses.enum';
import { ActionsEnum } from 'src/core/enums/actions.enum';
import { Auth } from 'src/core/decorators/auth.decorator';

@Controller('suppliers')
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Post()
  @Auth([{ resource: ResourcesEnum.SUPPLIERS, action: [ActionsEnum.CREATE] }])
  create(@Body() createSupplierDto: CreateSupplierDto) {
    return this.suppliersService.create(createSupplierDto);
  }

  @Get()
  @Auth([{ resource: ResourcesEnum.SUPPLIERS, action: [ActionsEnum.READ] }])
  findAll() {
    return this.suppliersService.findAll();
  }

  @Get(':id')
  @Auth([{ resource: ResourcesEnum.SUPPLIERS, action: [ActionsEnum.READ] }])
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.suppliersService.findOne(id);
  }

  @Put(':id')
  @Auth([{ resource: ResourcesEnum.SUPPLIERS, action: [ActionsEnum.UPDATE] }])
  update(@Param('id', ParseIntPipe) id: number, @Body() updateSupplierDto: UpdateSupplierDto) {
    return this.suppliersService.update(id, updateSupplierDto);
  }
}
