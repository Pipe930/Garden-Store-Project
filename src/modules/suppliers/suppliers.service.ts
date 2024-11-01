import { HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { ResponseData } from 'src/core/interfaces/response-data.interface';
import { Supplier } from './models/supplier.model';
import { Op } from 'sequelize';

@Injectable()
export class SuppliersService {
  async create(createSupplierDto: CreateSupplierDto): Promise<ResponseData> {

    const { name, website, phone, email, rating } = createSupplierDto;

    const supplierFind = await Supplier.findOne(
      { 
        where: {
          [Op.or]: [
            { phone },
            { email }
          ]
        }
      }
    );

    if(supplierFind) throw new NotFoundException("El proveedor ya existe");

    try {
      await Supplier.create({ name, website, phone, email, rating });
    } catch (error) {
      throw new InternalServerErrorException("Error al crear el proveedor");
    }

    return {
      statusCode: HttpStatus.CREATED,
      message: "Proveedor creado con exito"
    }
  }

  async findAll(): Promise<ResponseData> {

    const suppliers = await Supplier.findAll();

    if(suppliers.length === 0) return { message: "No tenemos proveedores registrados", statusCode: HttpStatus.NO_CONTENT }

    return {
      statusCode: HttpStatus.OK,
      data: suppliers
    };
  }

  async findOne(id: number): Promise<ResponseData> {

    const supplier = await Supplier.findByPk(id);

    if(!supplier) throw new NotFoundException("El proveedor no existe");

    return {
      statusCode: HttpStatus.OK,
      message: "Proveedor encontrado con exito",
      data: supplier
    };
  }

  async update(id: number, updateSupplierDto: UpdateSupplierDto): Promise<ResponseData> {

    const { name, website, phone, email, rating } = updateSupplierDto;

    const supplier = await Supplier.findByPk(id);

    if(!supplier) throw new NotFoundException("El proveedor no existe");

    try {

      supplier.name = name;
      supplier.website = website;
      supplier.phone = phone;
      supplier.email = email;
      supplier.rating = rating;

      await supplier.save();
    } catch (error) {
      throw new InternalServerErrorException("Error al actualizar el proveedor");
    }

    return {
      statusCode: HttpStatus.OK,
      message: "Proveedor actualizado con exito"
    };
  }
}
