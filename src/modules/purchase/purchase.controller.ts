import { Controller, Get, Post, Body, Param, Query, ParseIntPipe, DefaultValuePipe, Put, ParseUUIDPipe } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('purchases')
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  @Post()
  create(@Body() createPurchaseDto: CreatePurchaseDto) {
    return this.purchaseService.create(createPurchaseDto);
  }

  @Get()
  findAll(@Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number) {
    return this.purchaseService.findAll(page);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.purchaseService.findOne(id);
  }

  @Put(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updatePurchaseDto: UpdatePurchaseDto) {
    return this.purchaseService.update(id, updatePurchaseDto);
  }

  @Post('order-purchases')
  orderPurchase(@Body() createPurchaseDto: CreateOrderDto) {
    return this.purchaseService.createOrder(createPurchaseDto);
  }

  @Get('order-purchases')
  findAllOrders(@Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number) {
    return this.purchaseService.findAllOrders(page);
  }

  @Get('order-purchases/:id')
  findOneOrder(@Param('id', ParseUUIDPipe) id: string) {
    return this.purchaseService.findOneOrder(id);
  }

  @Put('order-purchases/:id')
  updateOrder(@Param('id', ParseUUIDPipe) id: string, @Body() updatePurchaseDto: UpdatePurchaseDto) {
    return this.purchaseService.updateOrder(id, updatePurchaseDto);
  }
}
