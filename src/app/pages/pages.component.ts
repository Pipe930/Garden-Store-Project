import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../core/interfaces/navbar';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { FooterComponent } from '../shared/footer/footer.component';

@Component({
  selector: 'app-pages',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  template: `
    <app-navbar [ObjectsNavbar]="listObjectsNavbar"></app-navbar>
    <router-outlet></router-outlet>
    <app-footer></app-footer>
  `
})
export class PagesComponent {

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
