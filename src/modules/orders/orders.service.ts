import { BadRequestException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './models/order.model';
import { ResponseData } from 'src/core/interfaces/response-data.interface';
import { Sale, SaleProduct } from '../sales/models/sale.model';
import { OrderStatusEnum } from 'src/core/enums/statusOrder.enum';
import { Product } from '../products/models/product.model';

@Injectable()
export class OrdersService {

  async create(createOrderDto: CreateOrderDto): Promise<ResponseData> {

    const { informationShipping, shippingCost } = createOrderDto;

    try {

      const newOrder = await Order.create({
        informationShipping,
        shippingCost
      })

      return {
        data: newOrder,
        message: "Se creo el envio correctamente",
        statusCode: HttpStatus.CREATED
      };

    } catch (error) {
      throw new InternalServerErrorException("Error no se creo el envio correctamente"); 
    }
  }

  async findAll(): Promise<ResponseData> {

    const orders = await Order.findAll();

    if(orders.length === 0) return { message: "No tenemos pedidos registrados", statusCode: HttpStatus.NO_CONTENT }

    return {
      data: orders,
      statusCode: HttpStatus.OK
    };
  }

  async findOne(idOrder: string): Promise<ResponseData> {

    const order = await Order.findByPk(idOrder);

    if(!order) throw new NotFoundException("No se encontro el pedido");

    return {
      data: order,
      statusCode: HttpStatus.OK
    };
  }

  async updateStateShipping(idOrder: string, updateOrderDto: UpdateOrderDto): Promise<ResponseData> {

    const { status, informationShipping, shippingCost, trackingNumber } = updateOrderDto;

    const sale = await Sale.findByPk(idOrder);
    const order = await Order.findByPk(idOrder);

    if(!order) throw new NotFoundException("No se encontro el envio");
    if(!sale) throw new NotFoundException("No se encontro el envio");
    if(order.statusOrder === OrderStatusEnum.DELIVERED) throw new BadRequestException("El envio ya fue entregado");

    try {

      order.statusOrder  = status;
      order.informationShipping = informationShipping;
      order.shippingCost = shippingCost;
      order.trackingNumber = trackingNumber;

      if(order.statusOrder === OrderStatusEnum.SHIPPED) order.shippingDate = new Date();
      if(order.statusOrder === OrderStatusEnum.DELIVERED) {

        order.deliveryDate = new Date();

        const productsSale = await SaleProduct.findAll<SaleProduct>({
          where: {
            idSale: sale.idSale
          }
        });

        productsSale.forEach(async (product) => {

          const productFind = await Product.findByPk(product.idProduct);

          productFind.sold += product.quantity;
          productFind.stock -= product.quantity;

          await productFind.save();
        })
      };

      await sale.save();
      await order.save();

      return {
        message: "Se actualizo el estado del envio",
        statusCode: HttpStatus.OK
      };

    } catch (error) {
      throw new InternalServerErrorException("Error no se actualizo el estado del envio"); 
    }
  }
}
