import { Role } from '@admin/interfaces/role';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AlertService } from '@core/services/alert.service';

export const hasRoleGuard: CanActivateFn = (route, state) => {

  const alertService = inject(AlertService);
  const router = inject(Router);

  const roles = route.data["roles"] as string[];
  const rolesUser = JSON.parse(sessionStorage.getItem("roles")!) as Role[];

  if (!rolesUser) return false;

  const roleValid = rolesUser.every((role) => roles.includes(role.name));

  if(!roleValid){

    alertService.error("Ruta Restringida", "No tienes permisos para realizar esta accion");
    router.navigate(["/"]);
    return false;
  }

  return true;
};
