import { Controller, Get, Post, Body, Param, Delete, UseGuards, ParseIntPipe, Put, Req } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { AuthGuard } from 'src/core/guards/auth.guard';
import { RequestJwt } from 'src/core/interfaces/request-jwt.interface';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    return this.subscriptionsService.create(createSubscriptionDto);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.subscriptionsService.findOne(id);
  }

  @Put('subscription/renovate')
  @UseGuards(AuthGuard)
  update(@Req() request: RequestJwt, @Body() updateSubscriptionDto: UpdateSubscriptionDto) {
    return this.subscriptionsService.update(request.user.idUser, updateSubscriptionDto);
  }

  @Delete('subscription/remove')
  @UseGuards(AuthGuard)
  remove(@Req() request: RequestJwt) {
    return this.subscriptionsService.remove(request.user.idUser);
  }
}
