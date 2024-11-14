import { ConflictException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { ResponseData } from 'src/core/interfaces/response-data.interface';
import { Supplier } from './models/supplier.model';
import { Op } from 'sequelize';
import { Address } from '../address/models/address.model';

@Injectable()
export class SuppliersService {
  async create(createSupplierDto: CreateSupplierDto): Promise<ResponseData> {

    const { fullName, rut, phone, email, idAddress } = createSupplierDto;

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
    const addressFind = await Address.findByPk(idAddress);

    if(!addressFind) throw new NotFoundException("La direccion no existe");
    if(supplierFind) throw new ConflictException("El proveedor ya existe");

    try {
      await Supplier.create({ fullName, rut, phone, email, idAddress });
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

    const { fullName, rut, phone, email, idAddress } = updateSupplierDto;

    const supplier = await Supplier.findByPk(id);
    const addressFind = await Address.findByPk(idAddress);

    if(!supplier) throw new NotFoundException("El proveedor no existe");
    if(!addressFind) throw new NotFoundException("La direccion no existe");

    try {

      supplier.fullName = fullName;
      supplier.rut = rut;
      supplier.phone = phone;
      supplier.email = email;
      supplier.idAddress = idAddress;

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
