import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AddressService } from './address.service';
import { AuthGuard } from 'src/core/guards/auth.guard';
import { CreateAddressDto } from './dto/create-address.dto';
import { RequestJwt } from 'src/core/interfaces/request-jwt.interface';

@Controller('address')
export class AddressController {
    constructor(private readonly addressService: AddressService) {}

    @Get('regions')
    findAllRegions() {
        return this.addressService.findAllRegions();
    }

    @Get('provinces')
    findAllProvinces() {
        return this.addressService.findAllProvinces();
    }

    @Get('communes')
    findAllCommunes() {
        return this.addressService.findAllCommunes();
    }

    @Get('provinces/:idRegion')
    findProvincesByRegion(@Param('idRegion', ParseIntPipe) idRegion: number) {
        return this.addressService.findProvincesByRegion(idRegion);
    }

    @Get('communes/:idProvince')
    findCommunesByProvince(@Param('idProvince', ParseIntPipe) idProvince: number) {
        return this.addressService.findCommunesByProvince(idProvince);
    }

    @Post('user')
    @UseGuards(AuthGuard)
    createAddress(@Body() createAddressDto: CreateAddressDto, @Req() request: RequestJwt) {
        return this.addressService.createAddressUser(createAddressDto, request.user.idUser);
    }

    @Get('user')
    @UseGuards(AuthGuard)
    findAllAddressesUser(@Req() request: RequestJwt) {
        return this.addressService.findAllAddressUser(request.user.idUser);
    }

    @Put('user/:idAddressUser')
    @UseGuards(AuthGuard)
    updateAddressUser(@Body() createAddressDto: CreateAddressDto, @Param('idAddressUser', ParseIntPipe) idAddressUser: number, @Req() request: RequestJwt) {
        return this.addressService.updateAddressUser( idAddressUser, request.user.idUser, createAddressDto);
    }

    @Delete('user/:idAddressUser')
    @UseGuards(AuthGuard)
    deleteAddressUser(@Param('idAddressUser', ParseIntPipe) idAddressUser: number, @Req() request: RequestJwt) {
        return this.addressService.deleteAddressUser(idAddressUser, request.user.idUser);
    }
}
