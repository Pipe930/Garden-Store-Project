import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { AuthGuard } from 'src/core/guards/auth.guard';
import { AddItemCartDto } from './dto/add-item-cart.dto';
import { SubstractItemCartDto } from './dto/substract-item-cart.dto';
import { RequestJwt } from 'src/core/interfaces/request-jwt.interface';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get("user")
  @UseGuards(AuthGuard)
  findCartUser(@Req() request: RequestJwt){
    return this.cartService.findCartUser(request.user.idUser);
  }

  @Post("add/item")
  @UseGuards(AuthGuard)
  addItemToCart(@Req() request: RequestJwt, @Body() addItemCartDto: AddItemCartDto){
    return this.cartService.addItemToCart(addItemCartDto, request.user.idUser);
  }

  @Post("substract/item")
  @UseGuards(AuthGuard)
  substractItemToCart(@Req() request: RequestJwt, @Body() substractItemCartDto: SubstractItemCartDto){
    return this.cartService.subsctractItemCart(substractItemCartDto, request.user.idUser);
  }

  @Delete("remove/item/:idProduct")
  @UseGuards(AuthGuard)
  removeItemToCart(@Req() request: RequestJwt, @Param('idProduct', ParseIntPipe) idProduct: number){
    return this.cartService.removeItemCart(idProduct, request.user.idUser);
  }

  @Delete("clear")
  @UseGuards(AuthGuard)
  clearCart(@Req() request: RequestJwt){
    return this.cartService.clearCart(request.user.idUser);
  }

}
