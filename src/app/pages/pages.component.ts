import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Navbar } from '../core/interfaces/navbar';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { FooterComponent } from '../shared/footer/footer.component';

@Component({
  selector: 'app-pages',
  standalone: true,
  imports: [RouterModule, NavbarComponent, FooterComponent],
  template: `
    <app-navbar [ObjectsNavbar]="listObjectsNavbar"></app-navbar>
    <router-outlet></router-outlet>
    <app-footer></app-footer>
  `
})
export class PagesComponent {


  // private readonly _sessionService = inject(SessionService);
  public theme: boolean = false;

  // The Icons are found on the page https://boxicons.com/
  public listObjectsNavbar: Array<Navbar> = [
    {
      name: "Productos",
      link: "/products",
      icon: "bx bxs-shopping-bag"
    },
    {
      name: "Ofertas",
      link: "/products/offer",
      icon: "bx bxs-offer"
    },
    {
      name: "Publicaciones",
      link: "/blog",
      icon: "bx bxl-blogger"
    },
    {
      name: "Suscripciones",
      link: "/subscriptions",
      icon: "bx bxs-dollar-circle"
    }
  ];

  ngOnInit(): void {

    // if(sessionStorage.getItem("access") || sessionStorage.getItem("refresh")){
    //   this._sessionService.changeTrueSession();
    // } else {
    //   this._sessionService.changeFalseSession();
    // }

  }

  public eventTheme(event: boolean):void{

    this.theme = event;

    if(!this.theme){
      localStorage.removeItem("theme");
      localStorage.setItem("theme", "light");
    } else {
      localStorage.removeItem("theme");
      localStorage.setItem("theme", "dark");
    }

  }
}
