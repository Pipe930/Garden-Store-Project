import { Controller, Get, Post, Body, Param, Req, Put, ParseUUIDPipe, Res } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { CreateTransbankDto } from './dto/create-transbank.dto';
import { UpdateSaleDto } from './dto/update-status-sale.dto';
import { RequestJwt } from 'src/core/interfaces/request-jwt.interface';
import { Auth } from 'src/core/decorators/auth.decorator';
import { ResourcesEnum } from 'src/core/enums/resourses.enum';
import { ActionsEnum } from 'src/core/enums/actions.enum';
import { Response } from 'express';
import { GeneratePDFDto } from './dto/generatePDF.dto';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  @Auth([{ resource: ResourcesEnum.SALES, action: [ActionsEnum.CREATE] }])
  create(@Body() createSaleDto: CreateSaleDto, @Req() request: RequestJwt) {
    return this.salesService.create(createSaleDto, request.user.idUser, request.headers['user-agent']);
  }

  @Get()
  @Auth([{ resource: ResourcesEnum.SALES, action: [ActionsEnum.READ] }])
  findAll() {
    return this.salesService.findAll();
  }

  @Get('analytics/:idSale')
  @Auth([{ resource: ResourcesEnum.SALES, action: [ActionsEnum.READ] }])
  getSaleAnalytics(@Param('idSale', ParseUUIDPipe) idSale: string) {
    return this.salesService.saleAnalytics(idSale);
  }

  @Get('detail/:idSale')
  @Auth([{ resource: ResourcesEnum.SALES, action: [ActionsEnum.READ] }])
  findOne(@Param('idSale', ParseUUIDPipe) idSale: string) {
    return this.salesService.findOne(idSale);
  }

  @Post('generatePDF')
  @Auth([{ resource: ResourcesEnum.SALES, action: [ActionsEnum.READ] }])
  async generatePDF(@Body() generatePdfDto: GeneratePDFDto, @Res() response: Response) {

    const pdfDoc = await this.salesService.generatePdfSale(generatePdfDto);
    response.setHeader('Content-Type', 'application/pdf');

    pdfDoc.pipe(response);
    pdfDoc.end();
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
