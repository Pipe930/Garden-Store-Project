import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  IonApp,
  IonSplitPane,
  IonMenu,
  IonContent,
  IonList,
  IonListHeader,
  IonNote,
  IonMenuToggle,
  IonItem,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonRouterLink,
  IonButton
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  close,
  paperPlaneOutline,
  paperPlaneSharp,
  bookmarkOutline,
  bookmarkSharp,
  folderOutline,
  enterOutline,
  cashOutline,
  bagOutline,
  cartOutline,
  qrCodeOutline,
  listOutline,
  bagSharp,
  folderSharp,
  cashSharp,
  cartSharp,
  enterSharp,
  listSharp,
  qrCodeSharp,
  personOutline,
  personSharp
} from 'ionicons/icons';
import { CategoryService } from './core/services/category.service';
import { HttpStatusCode } from '@angular/common/http';
import { Category } from './core/interfaces/category';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    CommonModule,
    IonApp,
    IonSplitPane,
    IonMenu,
    IonContent,
    IonList,
    IonListHeader,
    IonNote,
    IonMenuToggle,
    IonItem,
    IonIcon,
    IonLabel,
    IonRouterLink,
    IonRouterOutlet,
    IonButton
  ],
})
export class AppComponent {

  private readonly categoryService = inject(CategoryService);

  public appPages = [
    { title: 'Productos', url: '/list-products', icon: 'folder' },
    { title: 'Ofertas', url: '/ofertas', icon: 'cash' },
    { title: 'Login', url: '/login', icon: 'enter' },
    { title: 'Carrito', url: '/cart', icon: 'cart' },
    { title: 'Perfil', url: '/profile', icon: 'person' },
    { title: 'QR', url: '/escaner-qr', icon: 'qr-code' }
  ];
  public listCategories = signal<Category[]>([]);
  constructor() {
    addIcons({
      bagOutline,
      paperPlaneOutline,
      folderOutline,
      cashOutline,
      enterOutline,
      cartOutline,
      listOutline,
      qrCodeOutline,
      bagSharp,
      paperPlaneSharp,
      folderSharp,
      cashSharp,
      enterSharp,
      cartSharp,
      listSharp,
      qrCodeSharp,
      bookmarkOutline,
      close,
      personOutline,
      personSharp,
      bookmarkSharp });
  }

  ngOnInit(): void {

    this.categoryService.getCategories().subscribe(response => {
      if(response.statusCode === HttpStatusCode.Ok) this.listCategories.set(response.data);
    });
  }
}
