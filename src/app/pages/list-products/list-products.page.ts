import { Component, inject, OnInit, signal } from '@angular/core';
import { DecimalPipe, TitleCasePipe } from '@angular/common';import { ProductService } from 'src/app/core/services/product.service';
import { Images, Product } from 'src/app/core/interfaces/product';
import { environment } from 'src/environments/environment';
import { addIcons } from 'ionicons';
import { cart } from 'ionicons/icons';
import { RouterLink } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  LoadingController,
  IonSearchbar,
  IonButtons,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonList,
  IonItem,
  IonLabel,
  IonBackButton,
  IonIcon
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.page.html',
  styleUrls: ['./list-products.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonSearchbar,
    IonButtons,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonList,
    IonItem,
    IonLabel,
    IonBackButton,
    IonIcon,
    RouterLink,
    TitleCasePipe,
    DecimalPipe
  ]
})
export class ListProductsPage implements OnInit {

  private readonly productsService = inject(ProductService);
  private readonly loadingController = inject(LoadingController);

  public listProducts = signal<Product[]>([]);
  public urlImage = signal<string>(environment.apiImages);

  constructor() {
    addIcons({
      cart
    })
  }

  async ngOnInit() {
    const loading = await this.loadingController.create({
      message: 'Cargando...'
    });

    await loading.present();

    this.productsService.getProducts();
    this.productsService.listProducts$.subscribe(products => {
      if(products.length !== 0) this.listProducts.set(products);
      loading.dismiss();
    })
  }

  public getImageProduct(images: Images[]): string {

    if(images.length !== 0)
      return images.filter((image) => image.type === 'cover')[0].urlImage
    else return "";
  }

  public searchProduct(event: Event): void {

    const elemment = event.target as HTMLInputElement;

    this.productsService.searchProduct(elemment.value);
  }

}
