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
import { StatusSaleEnum } from 'src/core/enums/statusSale.enum';
import { OrderStatusEnum, WithdrawalEnum } from 'src/core/enums/statusOrder.enum';
import { randomUUID } from 'crypto';
import UAParser from 'ua-parser-js';
import { DeviceUsedEnum } from 'src/core/enums/deviceUsed.enum';
import { User } from '../users/models/user.model';
import { MethodPaymentEnum } from 'src/core/enums/statusPurchase.enum';
import { PrinterService } from 'src/printer/printer.service';
import { buildReport } from './documents/build.report';
import { GeneratePDFDto } from './dto/generatePDF.dto';
import { ResponseConvertPrice } from 'src/core/interfaces/response-convert';
import { CommitPaypalDto, CreatePaypalDto } from './dto/create-paypal';
import { RequestJwt } from 'src/core/interfaces/request-jwt.interface';
import { Branch } from '../branch/models/branch.model';
import { Order } from '../orders/models/order.model';

@Injectable()
export class SalesService {

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly printerService: PrinterService
  ) {}

  async create(createSaleDto: CreateSaleDto, idUser: number, userAgent: string):Promise<ResponseData> {

    let { priceTotal, productsQuantity, discountApplied, idBranch } = createSaleDto;

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
          model: Order
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
            model: Order
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

    const startTime = Date.now();

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
    
    const resultAnalytics = await this.httpService.axiosRef.post(`${this.configService.get<string>('modelIaUrl')}model/`, jsonAnalytics);

    if(resultAnalytics.status !== 200) throw new BadRequestException('Error al analizar la venta');

    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;

    const responseData = {
      ...resultAnalytics.data,
      duration
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Analisis de la venta realizado con exito',
      data: responseData
    }
  }

  async generatePdfSale(generatePdfDto: GeneratePDFDto): Promise<PDFKit.PDFDocument> {

    const { idSale, timeAnalytics, result } = generatePdfDto;

    const docDefinition = await buildReport(idSale, timeAnalytics, result);

    return this.printerService.createPDF(docDefinition);
  }

  async updateStatusSale(idSale: string, updateSaleDto: UpdateSaleDto): Promise<ResponseData> {

    const { status, methodPayment, shipping } = updateSaleDto;

    const sale = await Sale.findByPk(idSale);

    if(!sale) throw new NotFoundException('No se encontro la venta');
    if(sale.statusPayment === StatusSaleEnum.PAID) throw new BadRequestException('La venta ya se encuentra pagada');

    sale.statusPayment = status;
    sale.methodPayment = methodPayment;

    try {      
      
      if(sale.statusPayment === StatusSaleEnum.PAID && shipping.withdrawal === WithdrawalEnum.DELIVERY) {
  
        await Order.create({
          idOrderSale: sale.idSale,
          ...shipping,
          trackingNumber: this.generateTrackingNumber()
        });
      } else if(sale.statusPayment === StatusSaleEnum.PAID && shipping.withdrawal === WithdrawalEnum.IN_STORE) {

        const branch = await Branch.findByPk(sale.idBranch);

        await Order.create({
          idOrderSale: sale.idSale,
          informationShipping: "Pedido en entrega en sucursal",
          idAddress: branch.idAddress,
          withdrawal: shipping.withdrawal,
          shippingCost: 0,
          trackingNumber: this.generateTrackingNumber()
        });
      }

      await sale.save();

    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error al actualizar el estado de la venta');

    }

    return {

      statusCode: HttpStatus.OK,
      message: 'Estado de la venta actualizado con exito'
    }
  }

  async validSaleDelivered(idSale: string): Promise<ResponseData>{

    const sale = await Sale.findByPk(idSale);

    if(!sale) throw new NotFoundException("No se a encontro ninguna compra");
    if(sale.statusPayment === StatusSaleEnum.PENDING || sale.statusPayment === StatusSaleEnum.CANCELED) throw new BadRequestException("Esta compra no se encuentra pagada");

    const order = await Order.findByPk(idSale);

    if(order.statusOrder === OrderStatusEnum.DELIVERED) throw new BadRequestException("Este pedido ya ah sido entregado");

    try {      
      order.statusOrder = OrderStatusEnum.DELIVERED;
      order.deliveryDate = new Date();
  
      await order.save();
    } catch (error){
      throw new InternalServerErrorException("No se puedo validar la entrega del pedido");
    }

    return {
      statusCode: HttpStatus.OK,
      message: "El pedido a sido validado con exito"
    }
  }

  async createTransbankTransaction(createTransbankDto: CreateTransbankDto, request: RequestJwt): Promise<ResponseData> {

    const { amount } = createTransbankDto;

    const token = request.headers.authorization.split(' ')[1].split(".");
    const uuid = randomUUID().split("-").join("");

    try {
      const responseTransbank = await this.httpService.axiosRef.post('https://webpay3gint.transbank.cl/rswebpaytransaction/api/webpay/v1.2/transactions', {
        buy_order: uuid.substring(1, 25),
        session_id: token[2],
        amount,
        return_url: `${this.configService.get<string>('domainUrl')}/purchase-confirm`
      }, {
        headers: this.headerRequestTransbank()
      });

      return {
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

      return {
        statusCode: HttpStatus.OK,
        message: 'Transaccion confirmada con exito',
        data: responseTransbank.data
      }
    } catch (error) {
      throw new BadRequestException('No se pudo confirmar la transaccion');
    }
  }

  async createPaypalTransaction(createPaypalDto: CreatePaypalDto): Promise<ResponseData> {

    try {

      const responseDolar = await this.httpService.axiosRef.get('https://cl.dolarapi.com/v1/cotizaciones/usd');

      const convertPrice: ResponseConvertPrice = responseDolar.data;
      const dolarConvert = createPaypalDto.amount / convertPrice.venta;

      const jsonPaypal = { 
        intent: "CAPTURE", 
        purchase_units: [ 
          { 
            reference_id: randomUUID(), 
            amount: { 
              currency_code: "USD", 
              value: Number.parseFloat(dolarConvert.toFixed(2)).toString(), 
            },
            description: "Venta de productos",
          } 
        ],
        application_context: {
          brand_name: "Garden Store",
          landing_page: "LOGIN",
          user_action: "PAY_NOW",
          shipping_preference: "NO_SHIPPING",
          return_url: `${this.configService.get<string>('domainUrl')}/purchase-confirm`,
          cancel_url: `${this.configService.get<string>('domainUrl')}/purhase`
        }
      }


      const reponsePaypal = await this.httpService.axiosRef.post(`${this.configService.get<string>('paypalUrlApi')}/v2/checkout/orders`, jsonPaypal, {
        headers: {
          Authorization: `Bearer ${await this.createTokenPaypal()}`,
        }
      });

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Transaccion de paypal creada con exito',
        data: reponsePaypal.data
      }
    } catch (error) {
      throw new InternalServerErrorException('No se pudo crear la transaccion de paypal');
    }
  }

  async commitPaypalTransaction(commitPaypal: CommitPaypalDto): Promise<ResponseData>{

    const { token } = commitPaypal;

    try {
      const responsePaypal = await this.httpService.axiosRef.post(`${this.configService.get<string>('paypalUrlApi')}/v2/checkout/orders/${token}/capture`, {}, {
        auth: {
          username: this.configService.get<string>('paypalClientId'),
          password: this.configService.get<string>('paypalSecretKey')
        }
      });
  
      return {
        statusCode: HttpStatus.OK,
        message: 'Transaccion de paypal confirmada con exito',
        data: responsePaypal.data
      }
    } catch (error) {
      throw new InternalServerErrorException('No se pudo confirmar la transaccion de paypal');
    }
  }

  private generateTrackingNumber(): string {
    return randomUUID().split('-')[0].toUpperCase();
  }

  private async createTokenPaypal(): Promise<string> {

    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');

    const tokenAccess = await this.httpService.axiosRef.post(`${this.configService.get<string>('paypalUrlApi')}/v1/oauth2/token`, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      auth: {
        username: this.configService.get<string>('paypalClientId'),
        password: this.configService.get<string>('paypalSecretKey')
      }
    });

    return tokenAccess.data["access_token"];
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
