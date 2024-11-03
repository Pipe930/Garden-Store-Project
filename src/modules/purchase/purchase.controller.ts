import { Controller, Get, Post, Body, Param, Query, ParseIntPipe, DefaultValuePipe, Put, ParseUUIDPipe } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { Auth } from 'src/core/decorators/auth.decorator';
import { ResourcesEnum } from 'src/core/enums/resourses.enum';
import { ActionsEnum } from 'src/core/enums/actions.enum';

@Controller('purchases')
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  @Post()
  @Auth([{ resource: ResourcesEnum.PURCHASES, action: [ActionsEnum.CREATE]}])
  create(@Body() createPurchaseDto: CreatePurchaseDto) {
    return this.purchaseService.create(createPurchaseDto);
  }

  @Get()
  @Auth([{ resource: ResourcesEnum.PURCHASES, action: [ActionsEnum.READ]}])
  findAll(@Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number) {
    return this.purchaseService.findAll(page);
  }

  @Get(':id')
  @Auth([{ resource: ResourcesEnum.PURCHASES, action: [ActionsEnum.READ]}])
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.purchaseService.findOne(id);
  }

  @Put(':id')
  @Auth([{ resource: ResourcesEnum.PURCHASES, action: [ActionsEnum.UPDATE]}])
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updatePurchaseDto: UpdatePurchaseDto) {
    return this.purchaseService.update(id, updatePurchaseDto);
  }

  @Post('order-purchases')
  @Auth([{ resource: ResourcesEnum.PURCHASES, action: [ActionsEnum.CREATE]}])
  orderPurchase(@Body() createPurchaseDto: CreateOrderDto) {
    return this.purchaseService.createOrder(createPurchaseDto);
  }

  @Get('order-purchases')
  @Auth([{ resource: ResourcesEnum.PURCHASES, action: [ActionsEnum.READ]}])
  findAllOrders(@Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number) {
    return this.purchaseService.findAllOrders(page);
  }

  @Get('order-purchases/:id')
  @Auth([{ resource: ResourcesEnum.PURCHASES, action: [ActionsEnum.READ]}])
  findOneOrder(@Param('id', ParseUUIDPipe) id: string) {
    return this.purchaseService.findOneOrder(id);
  }

  @Put('order-purchases/:id')
  @Auth([{ resource: ResourcesEnum.PURCHASES, action: [ActionsEnum.UPDATE]}])
  updateOrder(@Param('id', ParseUUIDPipe) id: string, @Body() updatePurchaseDto: UpdatePurchaseDto) {
    return this.purchaseService.updateOrder(id, updatePurchaseDto);
  }
}
