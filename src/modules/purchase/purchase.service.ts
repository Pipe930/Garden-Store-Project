import { BadRequestException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { Supplier } from './models/supplier.model';
import { Employee } from '../branch/models/employee.model';
import { Purchase, PurchaseProduct } from './models/purchase.model';
import { Product } from '../products/models/product.model';
import { ResponseData } from 'src/core/interfaces/response-data.interface';
import { CreateOrderDto } from './dto/create-order.dto';
import { PurchaseOrder } from './models/purchase-order.model';
import { Branch } from '../branch/models/branch.model';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class PurchaseService {
  async create(createPurchaseDto: CreatePurchaseDto): Promise<ResponseData> {

    const {
      quantityTotal,
      totalPrice,
      ivaPrice,
      status,
      discountsAplicated,
      methodPayment,
      invoiveNumber,
      idSupplier,
      idEmployee,
      listProducts
    } = createPurchaseDto;

    const supplierExists = await Supplier.findByPk(idSupplier);
    const employeeExists = await Employee.findByPk(idEmployee);

    if(!supplierExists) throw new NotFoundException("El proveedor no existe");
    if(!employeeExists) throw new NotFoundException("El empleado no existe");

    const purchase = Purchase.build({
      quantityTotal,
      totalPrice,
      ivaPrice,
      status,
      discountsAplicated,
      methodPayment,
      invoiveNumber,
      idSupplier,
      idEmployee
    });

    const productsParserList = [];

    listProducts.forEach(async (product) => {

      const productExists = await Product.findByPk(product.idProduct);

      if(!productExists) throw new BadRequestException("El producto ingresado no existe");

      const newPurchaseProduct = PurchaseProduct.build({
        quantity: product.quantity,
        idProduct: product.idProduct,
        idPurchase: purchase.id
      });

      productsParserList.push(newPurchaseProduct);
    });

    productsParserList.forEach(async (product) => {
      await product.save();
    });

    await purchase.save();

    return {
      message: "Compra creada con éxito",
      statusCode: HttpStatus.CREATED
    };
  }

  async findAll(page: number): Promise<ResponseData> {

    const limit = 20;
    const offset = (page - 1) * limit;
    const purchases = await Purchase.findAll({
      include: [
        {
          model: Product,
          as: "products"
        }
      ],
      limit,
      offset
    });

    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(await Product.count() / limit);

    if(purchases.length === 0) return { message: "No tenemos compras registradas", statusCode: HttpStatus.NO_CONTENT }

    return {
      statusCode: HttpStatus.OK,
      data: purchases,
      count: purchases.length,
      currentPage,
      totalPages
    };
  }

  async findOne(uuid: string): Promise<ResponseData> {

    const purchase = await Purchase.findByPk(uuid, {
      include: [
        {
          model: Product,
          as: "products"
        }
      ]
    });

    if(!purchase) throw new NotFoundException("La compra no existe");

    return {
      statusCode: HttpStatus.OK,
      data: purchase
    };
  }

  async update(uuid: string, updatePurchaseDto: UpdatePurchaseDto): Promise<ResponseData> {

    const { status } = updatePurchaseDto;

    const purchase = await Purchase.findByPk(uuid);

    if(!purchase) throw new NotFoundException("La compra no existe");

    purchase.status = status;
    await purchase.save();

    return {
      message: "El estado de la compra a sido actualizada con éxito",
      statusCode: HttpStatus.OK
    };
  }


  async createOrder(createOrderDto: CreateOrderDto): Promise<ResponseData> {

    const {
      idPurchaseOrder,
      dateDelivery,
      shippingCost,
      addressShipping,
      idBranch
    } = createOrderDto;

    const purchaseExists = await Purchase.findByPk(idPurchaseOrder);
    const branchExists = await Branch.findByPk(idBranch);

    if(!purchaseExists) throw new NotFoundException("La compra no existe");
    if(!branchExists) throw new NotFoundException("La sucursal no existe");

    try {
      
      PurchaseOrder.create({
        dateDelivery,
        shippingCost,
        addressShipping,
        idBranch,
        idPurchaseOrder
      });
    } catch (error) {
      throw new InternalServerErrorException("Error al crear la orden de compra");
    }

    return {
      message: "Orden de compra creada con éxito",
      statusCode: HttpStatus.CREATED
    };
  }

  async findAllOrders(page: number): Promise<ResponseData> {

    const limit = 20;
    const offset = (page - 1) * limit;
    const orders = await PurchaseOrder.findAll({
      include: [
        {
          model: Purchase,
          as: "purchase"
        }
      ],
      limit,
      offset
    });

    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(await PurchaseOrder.count() / limit);

    if(orders.length === 0) return { message: "No tenemos ordenes de compra registradas", statusCode: HttpStatus.NO_CONTENT }

    return {
      statusCode: HttpStatus.OK,
      data: orders,
      count: orders.length,
      currentPage,
      totalPages
    };
  }

  async findOneOrder(uuid: string): Promise<ResponseData> {

    const order = await PurchaseOrder.findByPk(uuid, {
      include: [
        {
          model: Purchase,
          as: "purchase"
        }
      ]
    });

    if(!order) throw new NotFoundException("La orden de compra no existe");

    return {
      statusCode: HttpStatus.OK,
      data: order
    };
  }

  async updateOrder(uuid: string, updateOrderDto: UpdateOrderDto): Promise<ResponseData> {

    const { status } = updateOrderDto;

    const order = await PurchaseOrder.findByPk(uuid);

    if(!order) throw new NotFoundException("La orden de compra no existe");

    order.status = status;
    await order.save();

    return {
      message: "El estado de la orden de compra a sido actualizada con éxito",
      statusCode: HttpStatus.OK
    };
  }
}
