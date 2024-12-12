import { BadRequestException, ConflictException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { Subscription, SubscriptionStatus } from './models/subscription.model';
import { ResponseData } from 'src/core/interfaces/response-data.interface';

@Injectable()
export class SubscriptionsService {
  async create(createSubscriptionDto: CreateSubscriptionDto, idUser: number): Promise<ResponseData> {

    const { mount } = createSubscriptionDto;

    const subscriptionExists = await Subscription.findByPk(idUser);

    if (subscriptionExists) throw new ConflictException("Ya tienes una suscripción activa");

    try {

      const newSubscription = await Subscription.create({
        mount
      });

      return {
        message: 'Se creó la suscripción correctamente',
        data: newSubscription,
        statusCode: HttpStatus.CREATED
      }
    }
    catch (error) {
      throw new InternalServerErrorException("No se creo la suscripción correctamente");
    }
  }

  async findOne(id: number): Promise<ResponseData> {

    const subscription = await Subscription.findByPk(id);

    if (!subscription) throw new NotFoundException("No se encontró la suscripción");

    return {
      data: subscription,
      statusCode: HttpStatus.OK
    };
  }

  async update(id: number, updateSubscriptionDto: UpdateSubscriptionDto): Promise<ResponseData> {

    const { mount } = updateSubscriptionDto;

    const subscription = await Subscription.findByPk(id);

    if (!subscription) throw new NotFoundException("No se encontró la suscripción");

    subscription.monthsPage += 1;
    subscription.mount += mount;
    subscription.status = SubscriptionStatus.ACTIVE;

    await subscription.save();

    return {
      message: "Se actualizó la suscripción",
      statusCode: HttpStatus.OK
    }
  }

  async remove(id: number): Promise<ResponseData> {

    const subscription = await Subscription.findByPk(id);

    if (!subscription) throw new NotFoundException("No se encontró la suscripción");
    
    subscription.status = SubscriptionStatus.INACTIVE;
    subscription.save();

    return {
      message: "Se eliminó la suscripción",
      statusCode: HttpStatus.OK
    };
  }
}
