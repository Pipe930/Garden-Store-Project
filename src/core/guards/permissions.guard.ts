import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionObject } from 'src/modules/access-control/dto/create-role.dto';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { RequestJwt } from '../interfaces/request-jwt.interface';
import { User } from 'src/modules/users/models/user.model';
import { Role } from 'src/modules/access-control/models/rol.model';
import { Permission } from 'src/modules/access-control/models/permission.model';

@Injectable()
export class PermissionsGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {

    const request = context.switchToHttp().getRequest<RequestJwt>();

    const permissionsReflect = this.reflector.getAllAndOverride<PermissionObject[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass()
    ])

    try {
      const rolesUser = await this.getRolesUser(request.user.idUser);
      
      let hasPermission = false;
      for(const role of rolesUser){
        for(const routePermission of permissionsReflect){
          
          const userPermission = role.permissions.find(
            (permission) => permission.resource === routePermission.resource,
          );

          if(!userPermission) continue;

          const allActionsAviable = routePermission.action.every((requieredAction) => userPermission.actions.includes(requieredAction));

          if(!allActionsAviable) continue;

          hasPermission = true;
        }
      }

      if(!hasPermission) throw new ForbiddenException("No tienes permisos para realizar esta accion");

      return true;
    } catch (error) {
      throw new ForbiddenException("No tienes permisos para realizar esta accion");
    }
  }

  private async getRolesUser(idUser: number): Promise<Role[]> {

    return await Role.findAll<Role>({
      include: [
        {
          model: User,
          where: {
            idUser
          }
        },
        {
          model: Permission
        }
      ]
    });
  }
}
