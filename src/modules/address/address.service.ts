import { HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ResponseData } from 'src/core/interfaces/response-data.interface';
import { Commune, Province, Region } from './models/locates.model';
import { CreateAddressDto, CreateAddressUserDto } from './dto/create-address.dto';
import { Address, AddressUser } from './models/address.model';

@Injectable()
export class AddressService {

    async findAllRegions(): Promise<ResponseData> {

        const regions = await Region.findAll<Region>();

        if (regions.length === 0) return { message: "No tenemos regiones registradas", statusCode: HttpStatus.NO_CONTENT }

        return {
            statusCode: HttpStatus.OK,
            message: "Regiones encontradas",
            data: regions
        };
    }

    async findAllProvinces(): Promise<ResponseData> {

        const provinces = await Province.findAll<Province>();

        if (provinces.length === 0) return { message: "No tenemos provincias registradas", statusCode: HttpStatus.NO_CONTENT }

        return {
            statusCode: HttpStatus.OK,
            message: "Regiones encontradas",
            data: provinces
        };
    }

    async findAllCommunes(): Promise<ResponseData> {

        const communes = await Commune.findAll<Commune>();

        if (communes.length === 0) return { message: "No tenemos comunas registradas", statusCode: HttpStatus.NO_CONTENT }

        return {
            statusCode: HttpStatus.OK,
            message: "Regiones encontradas",
            data: communes
        };
    }

    async findProvincesByRegion(idRegion: number): Promise<ResponseData> {

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

    async findCommunesByProvince(idProvince: number): Promise<ResponseData> {

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

    async findRegionById(idRegion: number): Promise<ResponseData> {

        const region = await Region.findByPk<Region>(idRegion);

        if (!region) throw new NotFoundException("No tenemos una región con ese id");

        return {
            statusCode: HttpStatus.OK,
            data: region
        };
    }

    async findProvinceById(idProvince: number): Promise<ResponseData> {

        const province = await Province.findByPk<Province>(idProvince);

        if (!province) throw new NotFoundException("No tenemos una provincia con ese id");

        return {
            statusCode: HttpStatus.OK,
            data: province
        };
    }

    async findCommuneById(idCommune: number): Promise<ResponseData> {

        const commune = await Commune.findByPk<Commune>(idCommune);

        if (!commune) throw new NotFoundException("No tenemos una comuna con ese id");

        return {
            statusCode: HttpStatus.OK,
            data: commune
        };
    }

    async findAllAddress(): Promise<ResponseData> {

        const addressList = await Address.findAll<Address>();

        if (addressList.length === 0) return { message: "No tenemos direcciones registradas", statusCode: HttpStatus.NO_CONTENT }

        return {
            statusCode: HttpStatus.OK,
            data: addressList
        }
    }

    async findOneAddress(idAddress: number): Promise<ResponseData> {

        const address = await Address.findByPk<Address>(idAddress);

        if (!address) throw new NotFoundException("No tenemos una dirección con ese id");
        
        return {
            statusCode: HttpStatus.OK,
            data: address
        }
    }

    async createAddress(createAddressDto: CreateAddressDto): Promise<ResponseData> {

        const { addressName, numDepartment, city, description, idCommune } = createAddressDto;

        const commune = await Commune.findByPk<Commune>(idCommune);

        if(!commune) throw new NotFoundException("La comuna no exite");

        try {
            await Address.create<Address>({
                addressName,
                numDepartment,
                city,
                description,
                idCommune
            });
        } catch (error) {
            throw new InternalServerErrorException("Error no se pudo crear la dirección");
        }

        return {
            statusCode: HttpStatus.CREATED,
            message: "La dirección se creo con exito"
        }
    }

    async createAddressUser(createAddressUserDto: CreateAddressUserDto, idUser: number): Promise<ResponseData> {   

        const { name, addressName, numDepartment, city, description, idCommune } = createAddressUserDto;

        const commune = await Commune.findByPk<Commune>(idCommune);

        if(!commune) throw new NotFoundException("La comuna no exite");

        const addressFind = await Address.findOne<Address>({
            where: {
                addressName
            }
        });

        try {

            let idAddress: number;

            if(!addressFind) {
                const newAddress = await Address.create<Address>({
                    addressName,
                    numDepartment,
                    city,
                    description,
                    idCommune
                });

                idAddress = newAddress.idAddress;
            } else {
                idAddress = addressFind.idAddress;
            }
    
            await AddressUser.create<AddressUser>({
                name,
                idAddress,
                idUser
            });
    
            return {
                statusCode: HttpStatus.CREATED,
                message: "La direccion se creo con exito"
            }
        } catch (error) {
            throw new InternalServerErrorException("Error no se pudo crear la dirección");
        }
    }

    async findAllAddressUser(idUser: number): Promise<ResponseData> {

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

        if (addressUser.length === 0) return { message: "No tenemos direcciones en este usuario", statusCode: HttpStatus.NO_CONTENT }

        return {
            statusCode: HttpStatus.OK,
            data: addressUser
        };
    }

    async findOneAddressUser(idAddress: number, idUser: number): Promise<ResponseData> {

        const addressUser = await AddressUser.findOne<AddressUser>({
            where: {
                idAddress,
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

        if (!addressUser) throw new NotFoundException("No tenemos una dirección con ese id");

        return {
            statusCode: HttpStatus.OK,
            data: addressUser
        };
    }

    async updateAddressUser(idAddress: number, idUser: number, createAddressUserDto: CreateAddressUserDto): Promise<ResponseData> {

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

        addressUser.name = name;
        address.addressName = addressName;
        address.numDepartment = numDepartment;
        address.city = city;
        address.description = description;
        address.idCommune = idCommune;

        await address.save();
        await addressUser.save();

        return {
            statusCode: HttpStatus.OK,
            message: "La dirección se actualizo con exito",
            data: address
        };
    }

    async deleteAddressUser(idAddress: number, idUser: number): Promise<ResponseData> {

        const addressUser = await AddressUser.findOne<AddressUser>({
            where: {
                idAddress,
                idUser
            }
        });

        if (!addressUser) throw new NotFoundException("No tenemos una dirección con ese id");

        await addressUser.destroy();

        return {
            statusCode: HttpStatus.NO_CONTENT,
            message: "La dirección se elimino con exito"
        };
    }
}
