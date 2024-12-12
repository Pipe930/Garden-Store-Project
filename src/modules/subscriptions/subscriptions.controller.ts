import { Controller, Get, Post, Body, Delete, UseGuards, Put, Req } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { AuthGuard } from 'src/core/guards/auth.guard';
import { RequestJwt } from 'src/core/interfaces/request-jwt.interface';
import { Auth } from 'src/core/decorators/auth.decorator';
import { ResourcesEnum } from 'src/core/enums/resourses.enum';
import { ActionsEnum } from 'src/core/enums/actions.enum';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post()
  @Auth([{ resource: ResourcesEnum.SUBSCRIPTIONS, action: [ActionsEnum.CREATE]}])
  create(@Body() createSubscriptionDto: CreateSubscriptionDto, @Req() request: RequestJwt) {
    return this.subscriptionsService.create(createSubscriptionDto, request.user.idUser);
  }

  @Get('subscription')
  @Auth([{ resource: ResourcesEnum.SUBSCRIPTIONS, action: [ActionsEnum.READ] }])
  findOne(@Req() request: RequestJwt) {
    return this.subscriptionsService.findOne(request.user.idUser);
  }

  @Put('subscription/renovate')
  @Auth([{ resource: ResourcesEnum.SUBSCRIPTIONS, action: [ActionsEnum.UPDATE] }])
  update(@Req() request: RequestJwt, @Body() updateSubscriptionDto: UpdateSubscriptionDto) {
    return this.subscriptionsService.update(request.user.idUser, updateSubscriptionDto);
  }

  @Delete('subscription/remove')
  @Auth([{ resource: ResourcesEnum.SUBSCRIPTIONS, action: [ActionsEnum.DELETE] }])
  remove(@Req() request: RequestJwt) {
    return this.subscriptionsService.remove(request.user.idUser);
  }
}
