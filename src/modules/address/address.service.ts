import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { ResponseData } from 'src/core/interfaces/response-data.interface';
import { Commune, Province, Region } from './models/locates.model';
import { CreateAddressDto } from './dto/create-address.dto';
import { Address, AddressUser } from './models/address.model';

@Injectable()
export class AddressService {

    async findAllRegions(): Promise<ResponseData> {

        const regions = await Region.findAll<Region>();

        if (regions.length === 0) throw new NotFoundException("No tenemos regiones registradas");

        return {
            statusCode: HttpStatus.OK,
            message: "Regiones encontradas",
            data: regions
        };
    }

    async findAllProvinces() {

        const provinces = await Province.findAll<Province>();

        if (provinces.length === 0) throw new NotFoundException("No tenemos provincias registradas");

        return {
            statusCode: HttpStatus.OK,
            message: "Regiones encontradas",
            data: provinces
        };
    }

    async findAllCommunes() {

        const communes = await Commune.findAll<Commune>();

        if (communes.length === 0) throw new NotFoundException("No tenemos comunas registradas");

        return {
            statusCode: HttpStatus.OK,
            message: "Regiones encontradas",
            data: communes
        };
    }

    async findProvincesByRegion(idRegion: number) {

        const provinces = await Province.findAll<Province>({
            where: {
                idRegion
            }
        });

        if (provinces.length === 0) throw new NotFoundException("No tenemos provincias en esta región");

        return {
            statusCode: HttpStatus.OK,
            data: provinces
        };
    }

    async findCommunesByProvince(idProvince: number) {

        const communes = await Commune.findAll<Commune>({
            where: {
                idProvince
            }
        });

        if (communes.length === 0) throw new NotFoundException("No tenemos comunas en esta provincia");

        return {
            statusCode: HttpStatus.OK,
            data: communes
        };
    }

    async createAddressUser(createAddressUserDto: CreateAddressDto, idUser: number) {   

        const { name, addressName, numDepartment, city, description, idCommune } = createAddressUserDto;

        const commune = await Commune.findByPk<Commune>(idCommune);

        if(!commune) throw new NotFoundException("No tenemos una comuna con ese id");

        const address = await Address.create<Address>({
            name,
            addressName,
            numDepartment,
            city,
            description,
            idCommune
        });

        await AddressUser.create<AddressUser>({
            idAddress: address.idAddress,
            idUser
        });

        return {
            statusCode: HttpStatus.CREATED,
            message: "La direccion se creo con exito",
            data: address
        }
    }

    async findAllAddressUser(idUser: number) {

        const addressUser = await AddressUser.findAll<AddressUser>({
            where: {
                idUser
            },
            include: [
                {
                    model: Address,

                    include: [
                        {
                            model: Commune,
                            attributes: ['idCommune', 'name']
                        }
                    ]
                }
            ]
            
        });

        if (addressUser.length === 0) throw new NotFoundException("No tenemos direcciones registradas con este usuario");

        return {
            statusCode: HttpStatus.OK,
            data: addressUser
        };
    }

    async updateAddressUser(idAddress: number, idUser: number, createAddressUserDto: CreateAddressDto) {

        const { name, addressName, numDepartment, city, description, idCommune } = createAddressUserDto;

        const commune = await Commune.findByPk<Commune>(idCommune);

        const addressUser = await AddressUser.findOne<AddressUser>({
            where: {
                idAddress,
                idUser
            }
        });
        const address = await Address.findByPk<Address>(idAddress);
        
        if(!commune) throw new NotFoundException("No tenemos una comuna con ese id");
        if (!addressUser) throw new NotFoundException("No tenemos una dirección con ese id");

        address.name = name;
        address.addressName = addressName;
        address.numDepartment = numDepartment;
        address.city = city;
        address.description = description;
        address.idCommune = idCommune;

        await address.save();

        return {
            statusCode: HttpStatus.OK,
            message: "La dirección se actualizo con exito",
            data: address
        };
    }

    async deleteAddressUser(idAddress: number, idUser: number) {

        const addressUser = await AddressUser.findOne<AddressUser>({
            where: {
                idAddress,
                idUser
            }
        });

        const address = await Address.findByPk<Address>(idAddress);

        if (!addressUser) throw new NotFoundException("No tenemos una dirección con ese id");

        await addressUser.destroy();
        await address.destroy();

        return {
            statusCode: HttpStatus.OK,
            message: "La dirección se elimino con exito"
        };
    }
}
