import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { Sale, SaleProduct, TypeStatus } from './models/sale.model';
import { Cart } from '../cart/models/cart.model';
import { Item } from '../cart/models/item.model';
import { ResponseData } from 'src/core/interfaces/response-data.interface';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { CreateTransbankDto } from './dto/create-transbank.dto';

@Injectable()
export class SalesService {

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {}

  async create(createSaleDto: CreateSaleDto, idUser: number):Promise<ResponseData> {

    let { priceTotal, productsQuantity, withdrawal, discountApplied } = createSaleDto;

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
      
      const sale = await Sale.create({
        
        priceIva: this.calculateIvaPrice(priceTotal),
        priceNet: this.calculateIvaPrice(priceTotal),
        priceTotal,
        productsQuantity,
        discountApplied,
        status: TypeStatus.PENDING,
        withdrawal,
        idUser
      });

      cartUser.items.forEach(async item => {
        await SaleProduct.create({
          idSale: sale.idSale,
          idProduct: item.idProduct,
          quantity: item.quantity
        });

        await item.destroy();
      });

      cartUser.quantityTotal = 0;
      cartUser.priceTotal = 0;
      cartUser.productsTotal = 0;
      cartUser.priceTotalDiscount = 0;

      await cartUser.save();

    } catch (error) {  
      throw new BadRequestException('No se pudo crear la venta');
    }
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Venta creada con exito'
    };
  }

  async findUserSales(idUser: number): Promise<ResponseData> {

    const sales = await Sale.findAll({
      where: {
        idUser
      },
      include: {
        model: SaleProduct
      }
    });

    if(sales.length === 0) throw new BadRequestException('No se encontraron ventas para el usuario');

    return {
      statusCode: HttpStatus.OK,
      data: sales
    };
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

    let percentageIva = 19 / 100;
    let netPrice = priceTotal - priceTotal * percentageIva;
    return netPrice;
  }
}
