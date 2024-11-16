import { Controller, Get, Post, Body, Param, UseGuards, Req, Put, ParseIntPipe, ParseUUIDPipe } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { AuthGuard } from 'src/core/guards/auth.guard';
import { CreateTransbankDto } from './dto/create-transbank.dto';
import { UpdateSaleDto } from './dto/update-status-sale.dto';
import { RequestJwt } from 'src/core/interfaces/request-jwt.interface';
import { Auth } from 'src/core/decorators/auth.decorator';
import { ResourcesEnum } from 'src/core/enums/resourses.enum';
import { ActionsEnum } from 'src/core/enums/actions.enum';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  @Auth([{ resource: ResourcesEnum.SALES, action: [ActionsEnum.CREATE] }])
  create(@Body() createSaleDto: CreateSaleDto, @Req() request: RequestJwt) {
    return this.salesService.create(createSaleDto, request.user.idUser, request.headers['user-agent']);
  }

  @Get('detail/:idSale')
  @Auth([{ resource: ResourcesEnum.SALES, action: [ActionsEnum.READ] }])
  findOne(@Param('idSale', ParseUUIDPipe) idSale: string) {
    return this.salesService.findOne(idSale);
  }

  @Get('user')
  @Auth([{ resource: ResourcesEnum.SALES, action: [ActionsEnum.READ] }])
  findAllSalesUser(@Req() request: RequestJwt) {
    return this.salesService.findUserSales(request.user.idUser);
  }

  @Put('status/:idSale')
  @Auth([{ resource: ResourcesEnum.SALES, action: [ActionsEnum.CREATE] }])
  cancelSale(@Param('idSale', ParseUUIDPipe) idSale: string, @Body() updateSateDto: UpdateSaleDto) {
    return this.salesService.updateStatusSale(idSale, updateSateDto);
  }

  @Post('transbank/create')
  @Auth([{ resource: ResourcesEnum.SALES, action: [ActionsEnum.CREATE] }])
  createTransbank(@Body() createTransbankDto: CreateTransbankDto) {
    return this.salesService.createTransbankTransaction(createTransbankDto);
  }

  @Get('transbank/commit/:token')
  @Auth([{ resource: ResourcesEnum.SALES, action: [ActionsEnum.CREATE] }])
  commitTransbank(@Param('token') token: string) {
    return this.salesService.commitTransbankTransaction(token);
  }
}
