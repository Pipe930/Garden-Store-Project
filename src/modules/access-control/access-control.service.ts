import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Role } from './models/rol.model';
import { ResponseData } from 'src/core/interfaces/response-data.interface';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class AccessControlService {

    async findAllRoles(): Promise<ResponseData>{

        const roles = await Role.findAll();

        if(roles.length === 0) throw new NotFoundException("No tenemos roles registrados");

        return {
            statusCode: HttpStatus.OK,
            data: roles
        };
    }

    async createRole(createRoleDto: CreateRoleDto): Promise<ResponseData>{

        const { name, description } = createRoleDto;

        const roleExists = await Role.findOne({
            where: {
                name: name.toLowerCase()
            }
        });

        if(roleExists) throw new BadRequestException("El nombre del rol ya existe");

        const roleCreated = await Role.create({
            name: name.toLowerCase(),
            description
        });

        return {
            statusCode: HttpStatus.CREATED,
            message: "Rol creado exitosamente",
            data: roleCreated
        };
    }

    async updateRole(idRole: number, createRoleDto: CreateRoleDto): Promise<ResponseData>{
        const { name, description } = createRoleDto;

        const role = await Role.update({
            name: name.toLowerCase(),
            description
        }, {
            where: {
                idRole
            }
        });

        if(role[0] === 0) throw new NotFoundException("El rol no existe");

        return {
            statusCode: HttpStatus.OK,
            message: "Rol actualizado exitosamente"
        };
    }
}
