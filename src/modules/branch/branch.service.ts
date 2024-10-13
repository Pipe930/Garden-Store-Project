import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ResponseData } from 'src/core/interfaces/response-data.interface';
import { Branch, ProductBranch } from './models/branch.model';
import { CreateStockBranchDto } from './dto/create-stock-branch.dto';
import { Product } from '../products/models/product.model';

interface BranchProduct {

  branch: Branch;
  product: Product;
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

  async createStockBranch(createStockBranchDto: CreateStockBranchDto): Promise<ResponseData> {
    
    const { idBranch, idProduct, quantity } = createStockBranchDto;

    const { branch, product } = await this.validExistsBranchProduct(idBranch, idProduct);

    const branchStock = await ProductBranch.findOne({
      where: {
        idBranch,
        idProduct
      }
    })

    if(branchStock){

      branchStock.quantity += quantity;
      await branchStock.save();

      branch.capacityOccupied += quantity;
      await branch.save();

      product.stock += quantity;
      await product.save();

      return {
        statusCode: 201,
        message: 'Se añadio el stock a la sucursal correctamente'
      }
    }

    try {
      
      await ProductBranch.create({
        idBranch,
        idProduct,
        quantity
      });
    } catch (error) {
      throw new BadRequestException('No se pudo añadir el stock a la sucursal correctamente');
    }

    branch.capacityOccupied += quantity;
    await branch.save();

    product.stock += quantity;
    await product.save();

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

  private async validExistsBranchProduct(idBranch: number, idProduct: number): Promise<BranchProduct> {

    const branch = await Branch.findByPk(idBranch);
    const product = await Product.findByPk(idProduct);

    if(!branch) throw new NotFoundException('La sucursal no existe');
    if(!product) throw new NotFoundException('El producto no existe');

    return { branch, product };
  }
}
