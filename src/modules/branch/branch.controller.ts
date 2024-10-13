import { Body, Controller, Get, Param, ParseIntPipe, Post} from '@nestjs/common';
import { BranchService } from './branch.service';
import { CreateStockBranchDto } from './dto/create-stock-branch.dto';

@Controller('branchs')
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @Get()
  findAll() {
    return this.branchService.findAll();
  }

  @Post()
  create(@Body() createStockBranchDto: CreateStockBranchDto) {
    return this.branchService.createStockBranch(createStockBranchDto);
  }

  @Get('stock/:idBranch/:idProduct')
  branchStock(@Param('idBranch', ParseIntPipe) idBranch: number, @Param('idProduct', ParseIntPipe) idProduct: number) {
    return this.branchService.getStockBranch(idBranch, idProduct);
  }
}
