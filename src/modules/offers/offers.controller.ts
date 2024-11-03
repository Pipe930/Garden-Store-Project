import { Controller, Get, Post, Body, Param, Put, ParseIntPipe } from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { Auth } from 'src/core/decorators/auth.decorator';
import { ResourcesEnum } from 'src/core/enums/resourses.enum';
import { ActionsEnum } from 'src/core/enums/actions.enum';

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  @Auth([{ resource: ResourcesEnum.OFFERS, action: [ActionsEnum.CREATE]}])
  create(@Body() createOfferDto: CreateOfferDto) {
    return this.offersService.create(createOfferDto);
  }

  @Get()
  @Auth([{ resource: ResourcesEnum.OFFERS, action: [ActionsEnum.READ]}])
  findAll() {
    return this.offersService.findAll();
  }

  @Get(':id')
  @Auth([{ resource: ResourcesEnum.OFFERS, action: [ActionsEnum.READ]}])
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.offersService.findOne(id);
  }

  @Put(':id')
  @Auth([{ resource: ResourcesEnum.OFFERS, action: [ActionsEnum.UPDATE]}])
  update(@Param('id', ParseIntPipe) id: number, @Body() updateOfferDto: UpdateOfferDto) {
    return this.offersService.update(+id, updateOfferDto);
  }
}
