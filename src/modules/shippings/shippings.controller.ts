import { Controller, Post, Body, Param, Put, ParseIntPipe } from '@nestjs/common';
import { ShippingsService } from './shippings.service';
import { CreateShippingDto } from './dto/create-shipping.dto';
import { UpdateShippingDto } from './dto/update-shipping.dto';
import { Auth } from 'src/core/decorators/auth.decorator';
import { ResourcesEnum } from 'src/core/enums/resourses.enum';
import { ActionsEnum } from 'src/core/enums/actions.enum';

@Controller('shippings')
export class ShippingsController {
  constructor(private readonly shippingsService: ShippingsService) {}

  @Post()
  @Auth([{ resource: ResourcesEnum.SHIPPINGS, action: [ ActionsEnum.CREATE ] }])
  create(@Body() createShippingDto: CreateShippingDto) {
    return this.shippingsService.create(createShippingDto);
  }

  @Put(':id')
  @Auth([{ resource: ResourcesEnum.SHIPPINGS, action: [ ActionsEnum.UPDATE ] }])
  update(@Param('id',  ParseIntPipe) id: number, @Body() updateShippingDto: UpdateShippingDto) {
    return this.shippingsService.updateStateShipping(id, updateShippingDto);
  }
}
