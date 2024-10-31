import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AddressService } from './address.service';
import { AuthGuard } from 'src/core/guards/auth.guard';
import { CreateAddressDto, CreateAddressUserDto } from './dto/create-address.dto';
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

    @Get('region/:idRegion')
    findRegionById(@Param('idRegion', ParseIntPipe) idRegion: number) {
        return this.addressService.findRegionById(idRegion);
    }

    @Get('province/:idProvince')
    findProvinceById(@Param('idProvince', ParseIntPipe) idProvince: number) {
        return this.addressService.findProvinceById(idProvince);
    }

    @Get('commune/:idCommune')
    findCommuneById(@Param('idCommune', ParseIntPipe) idCommune: number) {
        return this.addressService.findCommuneById(idCommune);
    }

    @Get('provinces/:idRegion')
    findProvincesByRegion(@Param('idRegion', ParseIntPipe) idRegion: number) {
        return this.addressService.findProvincesByRegion(idRegion);
    }

    @Get('communes/:idProvince')
    findCommunesByProvince(@Param('idProvince', ParseIntPipe) idProvince: number) {
        return this.addressService.findCommunesByProvince(idProvince);
    }

    @Post()
    createAddress(@Body() createAddressDto: CreateAddressDto) {
        return this.addressService.createAddress(createAddressDto);
    }

    @Get()
    findAllAddresses() {
        return this.addressService.findAllAddress();
    }

    @Get('admin/:idAddress')
    findOneAddress(@Param('idAddress', ParseIntPipe) idAddress: number) {
        return this.addressService.findOneAddress(idAddress);
    }

    @Post('user')
    @UseGuards(AuthGuard)
    createAddressUser(@Body() createAddressDto: CreateAddressUserDto, @Req() request: RequestJwt) {
        return this.addressService.createAddressUser(createAddressDto, request.user.idUser);
    }

    @Get('user')
    @UseGuards(AuthGuard)
    findAllAddressesUser(@Req() request: RequestJwt) {
        return this.addressService.findAllAddressUser(request.user.idUser);
    }

    @Get('user/:idAddressUser')
    @UseGuards(AuthGuard)
    findOneAddressUser(@Param('idAddressUser', ParseIntPipe) idAddressUser: number, @Req() request: RequestJwt) {
        return this.addressService.findOneAddressUser(idAddressUser, request.user.idUser);
    }

    @Put('user/:idAddressUser')
    @UseGuards(AuthGuard)
    updateAddressUser(@Body() createAddressDto: CreateAddressUserDto, @Param('idAddressUser', ParseIntPipe) idAddressUser: number, @Req() request: RequestJwt) {
        return this.addressService.updateAddressUser( idAddressUser, request.user.idUser, createAddressDto);
    }

    @Delete('user/:idAddressUser')
    @UseGuards(AuthGuard)
    deleteAddressUser(@Param('idAddressUser', ParseIntPipe) idAddressUser: number, @Req() request: RequestJwt) {
        return this.addressService.deleteAddressUser(idAddressUser, request.user.idUser);
    }
}
