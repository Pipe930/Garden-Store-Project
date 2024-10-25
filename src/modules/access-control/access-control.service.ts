import { ConflictException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Role } from './models/rol.model';
import { ResponseData } from 'src/core/interfaces/response-data.interface';
import { CreateRoleDto } from './dto/create-role.dto';
import { Permission, RolePermission } from './models/permission.model';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { ActionsEnum } from 'src/core/enums/actions.enum';

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

    async findOneRole(idRole: number): Promise<ResponseData>{

        const roleFind = await Role.findByPk<Role>(idRole, {
            include: [
                {
                    model: Permission,
                    attributes: ["idPermission", "resource", "actions"],
                    through: {
                        attributes: []
                    }
                }
            ]
        });

        if(!roleFind) throw new NotFoundException("El rol no existe");

        return {
            statusCode: HttpStatus.OK,
            data: roleFind
        }
    }

    async createRole(createRoleDto: CreateRoleDto): Promise<ResponseData>{

        const { name } = createRoleDto;

        const roleExists = await Role.findOne<Role>({
            where: {
                name: name.toLowerCase()
            }
        });

        if(roleExists) throw new ConflictException("El nombre del rol ya existe");

        try {
            const roleCreated = await Role.create<Role>({
                name: name.toLowerCase()
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
        
        const { name } = createRoleDto;

        const role = await Role.findByPk<Role>(idRole);

        if(!role) throw new NotFoundException("El rol no existe");

        role.name = name.toLowerCase();

        await role.save();

        return {
            statusCode: HttpStatus.OK,
            message: "Rol actualizado exitosamente"
        };
    }

    async findAllPermissions(): Promise<ResponseData>{

        const permissions = await Permission.findAll<Permission>();

        if(permissions.length === 0) throw new NotFoundException("No tenemos permisos registrados");

        return {
            statusCode: HttpStatus.OK,
            data: permissions
        };
    }

    async findOnePermission(idPermission: number): Promise<ResponseData>{

        const permissionFind = await Permission.findByPk<Permission>(idPermission);

        if(!permissionFind) throw new NotFoundException("El permiso no existe");

        return {
            statusCode: HttpStatus.OK,
            data: permissionFind
        }
    }

    async createPermission(createPermissionDto: CreatePermissionDto): Promise<ResponseData>{

        const { name, resource, actions } = createPermissionDto;

        const permissionExists = await Permission.findOne<Permission>({
            where: {
                name
            }
        });

        if(permissionExists) throw new ConflictException("El nombre del permiso ya existe");
        if(!this.validateUniqueActions(actions)) throw new ConflictException("Solo debe haber una accion por permiso");

        try {
            const permissionCreated = await Permission.create<Permission>({
                name,
                resource,
                actions
            });

            return {
                statusCode: HttpStatus.CREATED,
                message: "Permiso creado exitosamente",
                data: permissionCreated
            };
        } catch (error) {
            throw new InternalServerErrorException("Error al crear el permiso");
        }
    }

    async updatePermission(idPermission: number, createPermissionDto: CreatePermissionDto): Promise<ResponseData>{

        const { name, resource, actions } = createPermissionDto;

        const permission = await Permission.findByPk<Permission>(idPermission);

        if(!permission) throw new NotFoundException("El permiso no existe");
        if(!this.validateUniqueActions(actions)) throw new ConflictException("Solo debe haber una accion por permiso");

        permission.name = name;
        permission.resource = resource;
        permission.actions = actions;

        await permission.save();

        return {
            statusCode: HttpStatus.OK,
            message: "Permiso actualizado exitosamente"
        };
    }

    private validateUniqueActions(actions: ActionsEnum[]): boolean {
        return actions.length === new Set(actions).size;
    }
}
