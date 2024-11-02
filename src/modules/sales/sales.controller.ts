import { Controller, Get, Post, Body, Param, UseGuards, Req, Put, ParseIntPipe, ParseUUIDPipe } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { AuthGuard } from 'src/core/guards/auth.guard';
import { CreateTransbankDto } from './dto/create-transbank.dto';
import { UpdateSaleDto } from './dto/update-status-sale.dto';
import { RequestJwt } from 'src/core/interfaces/request-jwt.interface';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createSaleDto: CreateSaleDto, @Req() request: RequestJwt) {
    return this.salesService.create(createSaleDto, request.user.idUser);
  }

  @Get('user')
  @UseGuards(AuthGuard)
  findAllSalesUser(@Req() request: RequestJwt) {
    return this.salesService.findUserSales(request.user.idUser);
  }

  @Put('status/:idSale')
  @UseGuards(AuthGuard)
  cancelSale(@Param('idSale', ParseUUIDPipe) idSale: string, @Body() updateSateDto: UpdateSaleDto) {
    return this.salesService.updateStatusSale(idSale, updateSateDto);
  }

  @Post('transbank/create')
  @UseGuards(AuthGuard)
  createTransbank(@Body() createTransbankDto: CreateTransbankDto) {
    return this.salesService.createTransbankTransaction(createTransbankDto);
  }

  @Get('transbank/commit/:token')
  @UseGuards(AuthGuard)
  commitTransbank(@Param('token') token: string) {
    return this.salesService.commitTransbankTransaction(token);
  }
}
