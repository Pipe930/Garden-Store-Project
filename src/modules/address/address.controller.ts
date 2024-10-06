import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AddressService } from './address.service';
import { AuthGuard } from 'src/core/guards/auth.guard';
import { CreateAddressDto } from './dto/create-address.dto';

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
    createAddress(@Body() createAddressDto: CreateAddressDto, @Req() req: any) {
        return this.addressService.createAddressUser(createAddressDto, req.user.idUser);
    }

    @Get('user')
    @UseGuards(AuthGuard)
    findAllAddressesUser(@Req() req: any) {
        return this.addressService.findAllAddressUser(req.user.idUser);
    }

    @Put('user/:idAddressUser')
    @UseGuards(AuthGuard)
    updateAddressUser(@Body() createAddressDto: CreateAddressDto, @Param('idAddressUser', ParseIntPipe) idAddressUser: number, @Req() req: any) {
        return this.addressService.updateAddressUser( idAddressUser, req.user.idUser, createAddressDto);
    }

    @Delete('user/:idAddressUser')
    @UseGuards(AuthGuard)
    deleteAddressUser(@Param('idAddressUser', ParseIntPipe) idAddressUser: number, @Req() req: any) {
        return this.addressService.deleteAddressUser(idAddressUser, req.user.idUser);
    }
}
