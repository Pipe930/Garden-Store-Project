import { BadRequestException, ConflictException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { ResponseData } from 'src/core/interfaces/response-data.interface';
import { Offer } from './models/offer.model';

@Injectable()
export class OffersService {

  async create(createOfferDto: CreateOfferDto):Promise<ResponseData> {

    const { title, endDate, startDate, discount, description } = createOfferDto;

    await this.validTitleOffer(title);
    if (startDate >= endDate) throw new BadRequestException("La fecha de inicio debe ser anterior a la fecha de fin");

    try {
      
      const newOffer = await Offer.create({
        title: title.toLowerCase(),
        endDate,
        startDate,
        discount,
        description
      });

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Offer created successfully',
        data: newOffer
      }

    } catch (error) {
      throw new InternalServerErrorException("La oferta no se creo exitosamente");
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

    const offer = await Offer.findByPk(id);

    if(!offer) throw new NotFoundException("La oferta no existe");
    if(offer.title !== title) await this.validTitleOffer(title);

    try {

      offer.title = title;
      offer.endDate = endDate;
      offer.discount = discount;
      offer.description = description;

      await offer.save();

    } catch (error) {
      throw new BadRequestException("La oferta no se actualizo exitosamente");
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Oferta actualizada exitosamente',
      data: offer
    }
  }

  private async validTitleOffer(title: string): Promise<void> {

    const offer = await Offer.findOne({ where: { title: title.toLowerCase() } });

    if(offer) throw new ConflictException("La oferta ya existe");
  }
}
