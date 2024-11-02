import { Module } from '@nestjs/common';
import { BranchService } from './branch.service';
import { BranchController } from './branch.controller';
import { ProductsService } from '../products/products.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [BranchController],
  imports: [HttpModule],
  providers: [
    BranchService,
    ProductsService
  ],
})
export class BranchModule {}
