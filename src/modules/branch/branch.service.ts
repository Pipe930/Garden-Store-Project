import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ResponseData } from 'src/core/interfaces/response-data.interface';
import { Branch, ProductBranch } from './models/branch.model';
import { CreateStockBranchDto } from './dto/create-stock-branch.dto';
import { Product } from '../products/models/product.model';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { Employee } from './models/employee.model';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Op } from 'sequelize';
import { CreateBranchDto } from './dto/create-branch.dto';
import { Address } from '../address/models/address.model';

interface BranchProduct {

  branch: Branch;
  productFind: Product;
}

@Injectable()
export class BranchService {

  async findAll(): Promise<ResponseData> {

    const branches = await Branch.findAll();

    if(branches.length === 0) throw new NotFoundException('No tenemos sucursales registradas');
    
    return {
      statusCode: 200,
      data: branches
    };
  }

  async getBranch(idBranch: number): Promise<ResponseData> {
    
    const branch = await Branch.findByPk(idBranch, {
      include: [

        {
          model: Employee
        },
        {
          model: Product,
          attributes: ['idProduct', 'title'],
          through: {
            attributes: ['quantity']
          }
        }
      ]
    });

    if(!branch) throw new NotFoundException('La sucursal no existe');

    return {
      statusCode: 200,
      data: branch
    }
  }

  async createBranch(createBranchDto: CreateBranchDto): Promise<ResponseData> {

    const { 
      name, 
      tradeName, 
      postalCode, 
      email, 
      phone, 
      openingDate, 
      capacity, 
      idAddress
    } = createBranchDto;

    const addressFind = await Address.findByPk(idAddress);
    const branch = await Branch.findOne({
      where: {
        [Op.or]: {
          name,
          tradeName
        }
      }
    });

    if(!addressFind) throw new NotFoundException('La direccion no existe');
    if(branch) throw new ConflictException('La sucursal ya existe');

    try {

      await Branch.create({
        name,
        tradeName,
        postalCode,
        email,
        phone,
        openingDate,
        capacity,
        idAddress
      });

    } catch (error) {
      throw new InternalServerErrorException('Error No se pudo crear la sucursal correctamente');
    }
    
    return {
      statusCode: 201,
      message: 'Se creo la sucursal correctamente'
    }
  }

  async createStockBranch(createStockBranchDto: CreateStockBranchDto): Promise<ResponseData> {
    
    const { idBranch, products } = createStockBranchDto;

    for(let product of products){

      const { branch, productFind } = await this.validExistsBranchProduct(idBranch, product.idProduct);
  
      const branchStock = await ProductBranch.findOne({
        where: {
          idBranch,
          idProduct: product.idProduct
        }
      })
  
      if(branchStock){
  
        branchStock.quantity += product.quantity;
        await branchStock.save();
  
        branch.capacityOccupied += product.quantity;
        await branch.save();
  
        productFind.stock += product.quantity;
        await productFind.save();
      } else {

        try {
          
          await ProductBranch.create({
            idBranch,
            idProduct: product.idProduct,
            quantity: product.quantity
          });
        } catch (error) {
          throw new InternalServerErrorException('Error No se pudo añadir el stock a la sucursal correctamente');
        }
    
        branch.capacityOccupied += product.quantity;
        await branch.save();
    
        productFind.stock += product.quantity;
        await productFind.save();
      }
  
    }

    return {
      statusCode: 201,
      message: 'Se añadio el stock a la sucursal correctamente'
    }

  }

  async getStockBranch(idBranch: number, idProduct: number): Promise<ResponseData> {

    await this.validExistsBranchProduct(idBranch, idProduct);
  
    const branchStock = await ProductBranch.findOne({
      where: {
        idBranch,
        idProduct
      }
    })

    if(!branchStock) throw new NotFoundException('No hay stock del producto en la sucursal');

    return {
      statusCode: 200,
      data: branchStock
    }
  }

  async createEmployee(createEmployeeDto: CreateEmployeeDto): Promise<ResponseData> {

    const { 
      firstName, 
      lastName, 
      email, 
      phone, 
      birthday,
      gender,
      rut,
      dateContract,
      salary,
      condition,
      idBranch
    } = createEmployeeDto;

    const branch = await Branch.findByPk(idBranch);
    const employee = await Employee.findOne({
      where: {
        [Op.or]: {
          rut,
          email,
          phone
        }
      }
    });

    if(employee) throw new ConflictException('El empleado ya existe');
    if(!branch) throw new NotFoundException('La sucursal no existe');

    try {
      
      await Employee.create({
        firstName,
        lastName,
        email,
        phone,
        birthday,
        gender,
        rut,
        dateContract,
        salary,
        condition,
        idBranch
      });

    } catch (error) {
      throw new InternalServerErrorException('Error No se pudo añadir el empleado correctamente');
    }

    return {
      statusCode: 201,
      message: 'Se añadio el empleado a la sucursal correctamente'
    }
  }

  async findEmployeesByBranch(idBranch: number): Promise<ResponseData> {

    const branch = await Branch.findByPk(idBranch);

    if(!branch) throw new NotFoundException('La sucursal no existe');

    const employees = await Employee.findAll({
      where: {
        idBranch
      }
    });

    if(employees.length === 0) throw new NotFoundException('No hay empleados en la sucursal');

    return {
      statusCode: 200,
      data: employees
    }
  }

  async updateEmployee(idEmployee: number, updateEmployeeDto: UpdateEmployeeDto): Promise<ResponseData> {

    const { email, phone, dateContract, salary, condition, idBranch } = updateEmployeeDto;

    const employee = await Employee.findByPk(idEmployee);
    const branch = await Branch.findByPk(idBranch);

    if(!employee) throw new NotFoundException('El empleado no existe');
    if(!branch) throw new NotFoundException('La sucursal no existe');

    employee.email = email;
    employee.phone = phone;
    employee.dateContract = dateContract;
    employee.salary = salary;
    employee.condition = condition;
    employee.idBranch = idBranch;
    
    await employee.save();

    return {
      statusCode: 200,
      message: 'Se actualizo el empleado correctamente'
    }
  }

  async findOneEmployee(idEmployee: number): Promise<ResponseData> {

    const employee = await Employee.findByPk(idEmployee);

    if(!employee) throw new NotFoundException('El empleado no existe');

    return {
      statusCode: 200,
      data: employee
    }
  }

  private async validExistsBranchProduct(idBranch: number, idProduct: number): Promise<BranchProduct> {

    const branch = await Branch.findByPk(idBranch);
    const product = await Product.findByPk(idProduct);

    if(!branch) throw new NotFoundException('La sucursal no existe');
    if(!product) throw new NotFoundException('El producto no existe');

    return { branch, productFind: product};
  }
}
