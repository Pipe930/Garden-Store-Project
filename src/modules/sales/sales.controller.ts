import { Controller, Get, Post, Body, Param, UseGuards, Req, Put, ParseIntPipe } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { AuthGuard } from 'src/core/guards/auth.guard';
import { CreateTransbankDto } from './dto/create-transbank.dto';
import { UpdateSaleDto } from './dto/update-status-sale.dto';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post('')
  @UseGuards(AuthGuard)
  create(@Body() createSaleDto: CreateSaleDto, @Req() req: any) {
    return this.salesService.create(createSaleDto, req.user.idUser);
  }

  @Get('user')
  @UseGuards(AuthGuard)
  findAllSalesUser(@Req() req: any) {
    return this.salesService.findUserSales(req.user.idUser);
  }

  @Put('status/:idSale')
  @UseGuards(AuthGuard)
  cancelSale(@Param('idSale', ParseIntPipe) idSale: number, @Body() updateSateDto: UpdateSaleDto) {
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
