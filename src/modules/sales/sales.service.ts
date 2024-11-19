import { BadRequestException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateSaleDto, SaleAnalytics } from './dto/create-sale.dto';
import { Sale, SaleProduct } from './models/sale.model';
import { Cart } from '../cart/models/cart.model';
import { Item } from '../cart/models/item.model';
import { ResponseData } from 'src/core/interfaces/response-data.interface';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { CreateTransbankDto } from './dto/create-transbank.dto';
import { Product } from '../products/models/product.model';
import { UpdateSaleDto } from './dto/update-status-sale.dto';
import { Shipping } from '../shippings/models/shipping.model';
import { StatusSaleEnum } from 'src/core/enums/statusSale.enum';
import { ShippingStatusEnum, WithdrawalEnum } from 'src/core/enums/statusShipping.enum';
import { ProductsService } from '../products/products.service';
import { randomUUID } from 'crypto';
import UAParser from 'ua-parser-js';
import { DeviceUsedEnum } from 'src/core/enums/deviceUsed.enum';
import { User } from '../users/models/user.model';
import { MethodPaymentEnum } from 'src/core/enums/statusPurchase.enum';

@Injectable()
export class SalesService {

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly productService: ProductsService
  ) {}

  async create(createSaleDto: CreateSaleDto, idUser: number, userAgent: string):Promise<ResponseData> {

    let { priceTotal, productsQuantity, discountApplied, withdrawal, idBranch } = createSaleDto;

    const cartUser = await Cart.findOne({
      where: {
        idCartUser: idUser
      },
      include: {
        model: Item
      }
    });

    if(cartUser.items.length === 0) throw new BadRequestException('El carrito esta vacio');

    try {
      
      const newSale = await Sale.create({

        priceIva: this.calculateIvaPrice(priceTotal),
        priceNet: this.calculateNetPrice(priceTotal),
        priceTotal,
        productsQuantity,
        discountApplied,
        withdrawal,
        deviceUsed: this.getDeviceType(userAgent),
        status: StatusSaleEnum.PENDING,
        idUser,
        idBranch
      });

      cartUser.items.forEach(async item => {
        await SaleProduct.create({
          idSale: newSale.idSale,
          idProduct: item.idProduct,
          priceUnit: item.priceUnit,
          quantity: item.quantity
        });

        await item.destroy();
      });

      cartUser.quantityTotal = 0;
      cartUser.priceTotal = 0;
      cartUser.productsTotal = 0;
      cartUser.priceTotalDiscount = 0;

      await cartUser.save();

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Venta creada con exito',
        data: newSale
      };
    } catch (error) {
      throw new InternalServerErrorException('Error No se pudo crear la venta');
    }
  }

  async findAll(): Promise<ResponseData> {

    const sales = await Sale.findAll();

    if(sales.length === 0) return { message: "No se encontraron ventas", statusCode: HttpStatus.NO_CONTENT }

    return {
      statusCode: HttpStatus.OK,
      data: sales
    };
  }

  async findUserSales(idUser: number): Promise<ResponseData> {

    const sales = await Sale.findAll({
      where: {
        idUser
      },
      include: [
        {
          model: SaleProduct,
          include: [
            {
              model: Product,
              attributes: ['title', 'price']
            }
          ],
          attributes: ['quantity']
        },
        {
          model: Shipping
        }
      ]
    });

    if(sales.length === 0) return { message: "No se encontraron ventas en este usuario", statusCode: HttpStatus.NO_CONTENT }

    return {
      statusCode: HttpStatus.OK,
      data: sales
    };
  }
  
  async findOne(idSale: string): Promise<ResponseData> {

    const sale = await Sale.findByPk(idSale, 
      {
        include: [
          {
            model: SaleProduct,
            include: [
              {
                model: Product,
                attributes: ['title', 'price']
              }
            ],
            attributes: ['quantity']
          },
          {
            model: Shipping
          },
          {
            model: User,
            as: 'user',
            attributes: ['firstName', 'lastName', 'email', 'phone']
          }
        ]
      }
    );

    if(!sale) throw new NotFoundException('No se encontro la venta');

    return {
      statusCode: HttpStatus.OK,
      data: sale
    };
  }

  async saleAnalytics(idSale: string): Promise<ResponseData> {

    const sale = await Sale.findByPk(idSale, {
      include: [
        {
          model: SaleProduct,
          include: [
            {
              model: Product,
              attributes: ['idCategory']
            }
          ]
        }
      ]
    });

    
    if(!sale) throw new NotFoundException('No se encontro la venta');
    
    const user = await User.findByPk(sale.idUser);

    const accountAgeDays = new Date().getDate() - user.createdAt.getDate();

    const jsonAnalytics: SaleAnalytics = {

      transaction_amount: sale.priceTotal,
      payment_method: this.numberPaymentMethod(sale.methodPayment),
      quantity: sale.productsQuantity,
      customer_age: 20,
      account_age_days: accountAgeDays,
      transaction_hour: sale.createdAt.getHours(),
      product_category: sale.saleProducts[0].product.idCategory,
      device_used_desktop: sale.deviceUsed === DeviceUsedEnum.DESKTOP ? 1 : 0,
      device_used_mobile: sale.deviceUsed === DeviceUsedEnum.MOBILE ? 1 : 0,
      device_used_tablet: sale.deviceUsed === DeviceUsedEnum.TABLET ? 1 : 0
    }

    const resultAnalytics = await this.httpService.axiosRef.post('http://127.0.0.1:8000/model/', jsonAnalytics);

    if(resultAnalytics.status !== 200) throw new BadRequestException('Error al analizar la venta');

    return {
      statusCode: HttpStatus.OK,
      message: 'Analisis de la venta realizado con exito',
      data: resultAnalytics.data
    }
  }

  async updateStatusSale(idSale: string, updateSaleDto: UpdateSaleDto): Promise<ResponseData> {

    const { status, methodPayment, shipping } = updateSaleDto;

    const sale = await Sale.findByPk(idSale);

    if(!sale) throw new NotFoundException('No se encontro la venta');
    if(sale.statusPayment === StatusSaleEnum.PAID) throw new BadRequestException('La venta ya se encuentra pagada');

    sale.statusPayment = status;
    sale.methodPayment = methodPayment;

    try {      
      
      if(sale.statusPayment === StatusSaleEnum.PAID && sale.withdrawal === WithdrawalEnum.DELIVERY) {
  
        await Shipping.create({
          idShippingSale: sale.idSale,
          ...shipping,
          trackingNumber: randomUUID().split('-')[0].toUpperCase()
        })
      }

      await sale.save();

    } catch (error) {
      throw new InternalServerErrorException('Error al actualizar el estado de la venta');
    }

    return {

      statusCode: HttpStatus.OK,
      message: 'Estado de la venta actualizado con exito'
    }
  }

  async createTransbankTransaction(createTransbankDto: CreateTransbankDto): Promise<ResponseData> {

    const { buyOrder, sessionId, amount, returnUrl } = createTransbankDto;

    try {
      const responseTransbank = await this.httpService.axiosRef.post('https://webpay3gint.transbank.cl/rswebpaytransaction/api/webpay/v1.2/transactions', {
        buy_order: buyOrder,
        session_id: sessionId,
        amount,
        return_url: returnUrl
      }, {
        headers: this.headerRequestTransbank()
      });

      if(responseTransbank.status === 200) return {
        statusCode: HttpStatus.CREATED,
        message: 'Transaccion creada con exito',
        data: responseTransbank.data
      }

    } catch (error) {
      throw new BadRequestException('No se pudo crear la transaccion');
    }
  }

  async commitTransbankTransaction(token: string): Promise<ResponseData> {
      
    try {
      const responseTransbank = await this.httpService.axiosRef.put(`https://webpay3gint.transbank.cl/rswebpaytransaction/api/webpay/v1.2/transactions/${token}`, {}, {
        headers: this.headerRequestTransbank()
      });

      if(responseTransbank.status === 200) return {
        statusCode: HttpStatus.OK,
        message: 'Transaccion confirmada con exito',
        data: responseTransbank.data
      }
    } catch (error) {
      throw new BadRequestException('No se pudo confirmar la transaccion');
    }
  }

  private numberPaymentMethod(methodPayment: string): number {

    switch (methodPayment) {
      case MethodPaymentEnum.DEBIT_CARD: return 1;
      case MethodPaymentEnum.CREDIT_CARD: return 2;
      case MethodPaymentEnum.TRANSFER: return 3;
      default: return 0;
    }
  }

  private headerRequestTransbank() {
    
    return {
      "Authorization": "Token",
      "Tbk-Api-Key-Id": this.configService.get<string>('tbkApiKeyId'),
      "Tbk-Api-Key-Secret": this.configService.get<string>('tbkApiKeySecret'),
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      'Referrer-Policy': 'origin-when-cross-origin',
      }
  }

  private calculateIvaPrice(priceTotal: number): number {
    return priceTotal - this.calculateNetPrice(priceTotal);
  }

  private calculateNetPrice(priceTotal: number): number {
    return priceTotal - priceTotal * 0.19;
  }

  private async validateStatusSale(status: string, sale: Sale): Promise<void> {

    if(status === ShippingStatusEnum.DELIVERED){

      const products = await SaleProduct.findAll({
        where: {
          idSale: sale.idSale
        }
      });
  
      products.forEach(async productSale => {
  
        const product = await Product.findByPk(productSale.idProduct);
  
        if(product.stock < productSale.quantity) throw new BadRequestException('No hay stock suficiente para la venta');
  
        product.stock -= productSale.quantity;
        product.sold += productSale.quantity;

        await this.productService.validAvaibilityStatus(product.idProduct);
        await product.save();
      });
  
      sale.statusOrder = status;
      await sale.save();
    }
  }
  
  private getDeviceType(userAgent: string): DeviceUsedEnum {
    
    const parser = new UAParser(userAgent);
    const deviceType = parser.getDevice().type || 'desktop';
  
    switch (deviceType) {
      case 'mobile': return DeviceUsedEnum.MOBILE;
      case 'tablet': return DeviceUsedEnum.TABLET;
      default: return DeviceUsedEnum.DESKTOP;
    }
  }
}
