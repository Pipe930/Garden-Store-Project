import { Injectable, signal } from '@angular/core';
import { Session } from '../interfaces/session';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  public sessionActivate = signal<boolean>(false);

  public changeTrueSession():void{
    this.sessionActivate.set(true);
  }

  public changeFalseSession():void{
    this.sessionActivate.set(false);
  }

  public validSession():boolean {

    if(sessionStorage.getItem("accessToken") && sessionStorage.getItem("refreshToken")) return true;
    return false;
  }

  public getSession(): Session | null {

    if(this.validSession()){

      return {
        access: sessionStorage.getItem("accessToken") || null,
        refresh: sessionStorage.getItem("refreshToken") || null
      };
    }

    return null;

  }

  public clearSession():void{
    sessionStorage.clear();
  }
}
