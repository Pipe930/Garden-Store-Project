import { Controller, Get, Post, Body, Param, Put, ParseUUIDPipe } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ResourcesEnum } from 'src/core/enums/resourses.enum';
import { ActionsEnum } from 'src/core/enums/actions.enum';
import { Auth } from 'src/core/decorators/auth.decorator';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @Auth([{ resource: ResourcesEnum.ORDERS, action: [ ActionsEnum.READ ] }])
  findAll() {
    return this.ordersService.findAll();
  }

  @Post()
  @Auth([{ resource: ResourcesEnum.ORDERS, action: [ ActionsEnum.CREATE ] }])
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Get(':id')
  @Auth([{ resource: ResourcesEnum.ORDERS, action: [ ActionsEnum.READ ] }])
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.ordersService.findOne(id);
  }

  @Put(':id')
  @Auth([{ resource: ResourcesEnum.ORDERS, action: [ ActionsEnum.UPDATE ] }])
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.updateStateShipping(id, updateOrderDto);
  }
}
