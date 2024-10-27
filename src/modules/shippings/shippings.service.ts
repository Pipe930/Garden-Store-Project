import { BadRequestException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateShippingDto } from './dto/create-shipping.dto';
import { UpdateShippingDto } from './dto/update-shipping.dto';
import { ResponseData } from 'src/core/interfaces/response-data.interface';
import { Shipping } from './models/shipping.model';
import { ShippingStatusEnum } from 'src/core/enums/statusShipping.enum';

@Injectable()
export class ShippingsService {
  async create(createShippingDto: CreateShippingDto): Promise<ResponseData> {

    const { informationShipping, shippingCost, withdrawal, idAddress } = createShippingDto;

    try {

      const newShipping = await Shipping.create({
        informationShipping,
        shippingCost,
        status: ShippingStatusEnum.PREPARING,
        withdrawal,
        idAddress
      })

      return {
        data: newShipping,
        message: "Se creo el envio correctamente",
        statusCode: HttpStatus.CREATED
      };

    } catch (error) {
      throw new InternalServerErrorException("Error no se creo el envio correctamente"); 
    }
  }

  async updateStateShipping(idShipping: number, shippingStatusDto: UpdateShippingDto): Promise<ResponseData> {

    try {

      const shipping = await Shipping.findByPk(idShipping);

      if(!shipping) throw new NotFoundException("No se encontro el envio");
      if(shipping.status === ShippingStatusEnum.DELIVERED) throw new BadRequestException("El envio ya fue entregado");

      shipping.status = shippingStatusDto.status;

      if(shipping.status === ShippingStatusEnum.DELIVERED) shipping.deliveryDate = new Date();
      if(shipping.status === ShippingStatusEnum.SHIPPED) shipping.shippingDate = new Date();

      await shipping.save();

      return {
        message: "Se actualizo el estado del envio",
        statusCode: HttpStatus.OK
      };

    } catch (error) {
      throw new InternalServerErrorException("Error no se actualizo el estado del envio"); 
    }
  }
}
