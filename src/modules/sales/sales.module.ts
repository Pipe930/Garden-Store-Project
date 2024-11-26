import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { HttpModule } from '@nestjs/axios';
import { ProductsService } from '../products/products.service';
import { PrinterModule } from 'src/printer/printer.module';

@Module({
  imports: [HttpModule, PrinterModule],
  controllers: [SalesController],
  providers: [
    SalesService,
    ProductsService
  ],
})
export class SalesModule {}
