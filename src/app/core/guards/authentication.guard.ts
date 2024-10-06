import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from '../services/session.service';

export const authenticationGuard: CanActivateFn = (route, state) => {

  const sessionService = inject(SessionService);
  const router = inject(Router);

  if(!sessionService.validSession()){

    router.navigate(["auth/login"]);
    return false;
  }
  return true;
};
