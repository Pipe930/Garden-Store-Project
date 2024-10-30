import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Permission } from 'src/modules/access-control/dto/create-role.dto';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { RequestJwt } from '../interfaces/request-jwt.interface';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class PermissionsGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector, 
    private readonly userService: UsersService
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {

    const request = context.switchToHttp().getRequest<RequestJwt>();

    const permissionsReflect = this.reflector.getAllAndOverride<Permission[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass()
    ])

    try {
      const rolesUser = await this.userService.getUserPermissions(request.user.idUser);

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
}
