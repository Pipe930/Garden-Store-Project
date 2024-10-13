import { Controller, Post, Body, Param, UseGuards, Put, ParseIntPipe } from '@nestjs/common';
import { ShippingsService } from './shippings.service';
import { CreateShippingDto } from './dto/create-shipping.dto';
import { UpdateShippingDto } from './dto/update-shipping.dto';
import { AuthGuard } from 'src/core/guards/auth.guard';

@Controller('shippings')
export class ShippingsController {
  constructor(private readonly shippingsService: ShippingsService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createShippingDto: CreateShippingDto) {
    return this.shippingsService.create(createShippingDto);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  update(@Param('id',  ParseIntPipe) id: number, @Body() updateShippingDto: UpdateShippingDto) {
    return this.shippingsService.updateStateShipping(id, updateShippingDto);
  }
}
