import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { ResponseData } from 'src/core/interfaces/response-data.interface';
import { Offer } from './models/offer.model';

@Injectable()
export class OffersService {

  async create(createOfferDto: CreateOfferDto):Promise<ResponseData> {

    const { title, endDate, discount, description } = createOfferDto;

    try {
      
      const newOffer = await Offer.create({
        title,
        endDate,
        discount,
        description
      });

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Offer created successfully',
        data: newOffer
      }

    } catch (error) {
      throw new BadRequestException("La oferta no se creo exitosamente");
    }      
  }

  async findAll(): Promise<ResponseData> {

    const offers = await Offer.findAll();

    if(offers.length === 0) return { message: "No tenemos usuarios registrados", statusCode: HttpStatus.NO_CONTENT };

    return {
      statusCode: HttpStatus.OK,
      data: offers
    };
  }

  async findOne(id: number): Promise<ResponseData> {

    const offer = await Offer.findByPk(id);

    if(!offer) throw new NotFoundException("La oferta no existe");

    return {
      statusCode: HttpStatus.OK,
      data: offer
    };
  }

  async update(id: number, updateOfferDto: UpdateOfferDto) {

    const { title, endDate, discount, description } = updateOfferDto;

    try {
      
      const offer = await Offer.findByPk(id);

      if(!offer) throw new NotFoundException("La oferta no existe");

      offer.title = title;
      offer.endDate = endDate;
      offer.discount = discount;
      offer.description = description;

      await offer.save();

      return {
        statusCode: HttpStatus.OK,
        message: 'Offer updated successfully',
        data: offer
      }

    } catch (error) {
      throw new BadRequestException("La oferta no se actualizo exitosamente");
    }
  }

}
