import { BadRequestException, ConflictException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Role } from './models/rol.model';
import { ResponseData } from 'src/core/interfaces/response-data.interface';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class AccessControlService {

    async findAllRoles(): Promise<ResponseData>{

        const roles = await Role.findAll<Role>();

        if(roles.length === 0) throw new NotFoundException("No tenemos roles registrados");

        return {
            statusCode: HttpStatus.OK,
            data: roles
        };
    }

    async createRole(createRoleDto: CreateRoleDto): Promise<ResponseData>{

        const { name, description } = createRoleDto;

        const roleExists = await Role.findOne<Role>({
            where: {
                name: name.toLowerCase()
            }
        });

        if(roleExists) throw new ConflictException("El nombre del rol ya existe");

        try {
            const roleCreated = await Role.create<Role>({
                name: name.toLowerCase(),
                description
            });

            return {
                statusCode: HttpStatus.CREATED,
                message: "Rol creado exitosamente",
                data: roleCreated
            };
        } catch (error) {
            throw new InternalServerErrorException("Error al crear el rol");
        }
    }

    async updateRole(idRole: number, createRoleDto: CreateRoleDto): Promise<ResponseData>{
        const { name, description } = createRoleDto;

        const role = await Role.findByPk<Role>(idRole);

        if(!role) throw new NotFoundException("El rol no existe");

        role.name = name.toLowerCase();
        role.description = description;

        await role.save();

        return {
            statusCode: HttpStatus.OK,
            message: "Rol actualizado exitosamente"
        };
    }
}
