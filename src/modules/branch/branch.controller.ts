import { Body, Controller, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { BranchService } from './branch.service';
import { CreateStockBranchDto } from './dto/create-stock-branch.dto';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { CreateBranchDto } from './dto/create-branch.dto';
import { Auth } from 'src/core/decorators/auth.decorator';
import { ResourcesEnum } from 'src/core/enums/resourses.enum';
import { ActionsEnum } from 'src/core/enums/actions.enum';

@Controller('branchs')
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @Get()
  findAll() {
    return this.branchService.findAll();
  }

  @Post()
  @Auth([{ resource: ResourcesEnum.BRANCHS, action: [ActionsEnum.CREATE]}])
  createBranch(@Body() createBranchDto: CreateBranchDto) {
    return this.branchService.createBranch(createBranchDto);
  }

  @Get('branch/:id')
  @Auth([{ resource: ResourcesEnum.BRANCHS, action: [ActionsEnum.READ]}])
  getBranch(@Param('id', ParseIntPipe) id: number) {
    return this.branchService.getBranch(id);
  }

  @Post('stock')
  @Auth([{ resource: ResourcesEnum.BRANCHS, action: [ActionsEnum.CREATE]}])
  create(@Body() createStockBranchDto: CreateStockBranchDto) {
    return this.branchService.createStockBranch(createStockBranchDto);
  }

  @Get('stock/:idBranch')
  @Auth([{ resource: ResourcesEnum.BRANCHS, action: [ActionsEnum.READ]}])
  branchStock(@Param('idBranch', ParseIntPipe) idBranch: number, @Param('idProduct', ParseIntPipe) idProduct: number) {
    return this.branchService.getStockBranch(idBranch, idProduct);
  }

  
  @Get('employees')
  @Auth([{ resource: ResourcesEnum.EMPLOYEES, action: [ActionsEnum.READ]}])
  findAllEmployees() {
    return this.branchService.findAllEmployees();
  }
  
  @Post('employees')
  @Auth([{ resource: ResourcesEnum.EMPLOYEES, action: [ActionsEnum.CREATE]}])
  createEmployee(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.branchService.createEmployee(createEmployeeDto);
  }
  
  @Get('employees/:idBranch')
  @Auth([{ resource: ResourcesEnum.EMPLOYEES, action: [ActionsEnum.READ]}])
  findEmployees(@Param('idBranch', ParseIntPipe) id: number) {
    return this.branchService.findEmployeesByBranch(id);
  }

  @Put('employee/:id')
  @Auth([{ resource: ResourcesEnum.EMPLOYEES, action: [ActionsEnum.UPDATE]}])
  updateEmployee(@Param('id', ParseIntPipe) id: number, @Body() updateEmployeeDto: UpdateEmployeeDto) {
    return this.branchService.updateEmployee(id, updateEmployeeDto);
  }

  @Get('employee/:id')
  @Auth([{ resource: ResourcesEnum.EMPLOYEES, action: [ActionsEnum.READ]}])
  findEmployee(@Param('id', ParseIntPipe) id: number) {
    return this.branchService.findOneEmployee(id);
  }
}
