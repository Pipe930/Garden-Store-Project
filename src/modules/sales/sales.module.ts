import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { HttpModule } from '@nestjs/axios';
import { ProductsService } from '../products/products.service';

@Module({
  imports: [HttpModule],
  controllers: [SalesController],
  providers: [
    SalesService,
    ProductsService
  ],
})
export class SalesModule {}
