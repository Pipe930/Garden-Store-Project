import { NgClass } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidenavToggle } from '../core/interfaces/sidenav';
import { SidenavComponent } from '../shared/sidenav/sidenav.component';
import { HeaderComponent } from '../shared/header/header.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterOutlet, NgClass, SidenavComponent, HeaderComponent],
  template: `
    <app-sidenav (onToggleSideNav)="onToggleSideNav($event)"></app-sidenav>
    <div class="body" [ngClass]="getBodyClass()">
      <app-header></app-header>
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [
    `
      @import '../../themes/variables.scss';

      .body{

        width: calc(100% - 5rem);
        height: 100%;
        min-height: 100vh;
        margin-left: 5rem;
        z-index: 0;
        position: relative;
        top: 0;
        transition: all .3s ease;
        background-color: $color-light;
        padding: 1.6rem 3rem;
        background-color: $color-dark-200;
      }

      .body-trimmed{
        width: calc(100% - 17rem);
        margin-left: 17rem;
      }

      .body-md-screen{
        width: calc(100% - 5rem);
        margin-left: 5rem;
      }
    `
  ]
})
export class AdminComponent {

  public isSidenavCollapsed = signal<boolean>(false);
  public screenWidth = signal<number>(0);

  constructor() { }

  public onToggleSideNav(data: SidenavToggle):void {

    this.screenWidth.set(data.screenWidth);
    this.isSidenavCollapsed.set(data.collapsed);
  }

  public getBodyClass():string{

    let styleClass = "";
    if(this.isSidenavCollapsed() && this.screenWidth() > 768){
      styleClass = "body-trimmed";
    } else if(this.isSidenavCollapsed() && this.screenWidth() <= 768 && this.screenWidth() > 0) {
      styleClass = "body-md-screen"
    }
    return styleClass;
  }
}
