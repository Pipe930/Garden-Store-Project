import { Component, HostListener, inject, signal } from '@angular/core';
import { AuthService } from '@auth/services/auth.service';
import { SessionService } from '@core/services/session.service';
import { Router } from '@angular/router';
import { Items, Notifications, notifications, userItems } from './header-dummy-data';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgClass],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  private readonly _authService = inject(AuthService);
  private readonly _sessionService = inject(SessionService);
  private readonly _router = inject(Router);

  public canShowSearchAsOverlay = signal<boolean>(true);
  public listNotifications = signal<Notifications[]>(notifications);
  public listUserItems = signal<Items[]>(userItems);

  ngOnInit(): void {
    this.checkCanShowSearch(window.innerWidth);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any){
    this.checkCanShowSearch(window.innerWidth);
  }

  public checkCanShowSearch(innerWidth: number):void {

    if(innerWidth < 845){

      this.canShowSearchAsOverlay.set(true);
    } else {

      this.canShowSearchAsOverlay.set(false);
    }
  }

  public logout():void{

    this._authService.logout();
    sessionStorage.clear();
    this._sessionService.changeFalseSession();
    this._router.navigate(["home"]);
  }

}
