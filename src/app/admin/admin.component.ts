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
    <app-sidenav (onToggleSideNav)="onToggleSideNav($event)"/>
    <div class="body" [ngClass]="getBodyClass()">
      <app-header/>
      <div class="body__container">
        <router-outlet/>
      </div>
    </div>
    <footer class="sticky-footer bg-white py-4">
      <div class="container my-auto">
          <div class="copyright text-center my-auto">
              <span class="text-black-50">Copyright &copy; Garden Store 2024</span>
          </div>
      </div>
    </footer>
  `,
  styles: [
    `
      @import '../../themes/variables.scss';

      .body{

        width: calc(100% - 5rem);
        height: 100%;
        min-height: 100vh;
        margin-left: 5rem;
        position: relative;
        top: 0;
        transition: all .3s ease;
        background-color: $color-light;
        padding: 1.6rem 3rem;
        background-color: $color-dark-200;

        .body__container{

          background-color: $color-light;
          padding: 1.8rem;
          border-radius: .6rem;
          box-shadow: 10px 10px 8px -8px $color-dark-300;
        }
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
