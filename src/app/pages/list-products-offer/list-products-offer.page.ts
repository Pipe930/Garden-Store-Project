import { Component, inject, OnInit, signal } from '@angular/core';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonTitle,
  IonToolbar,
  LoadingController
} from '@ionic/angular/standalone';
import { environment } from 'src/environments/environment';
import { Images, Product } from 'src/app/core/interfaces/product';
import { ProductService } from 'src/app/core/services/product.service';
import { addIcons } from 'ionicons';
import { cart } from 'ionicons/icons';
import { DecimalPipe, TitleCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-list-products-offer',
  templateUrl: './list-products-offer.page.html',
  styleUrls: ['./list-products-offer.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonCardTitle,
    IonCardSubtitle,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    IonIcon,
    TitleCasePipe,
    DecimalPipe,
    RouterLink
  ]
})
export class ListProductsOfferPage implements OnInit {

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

    this.productsService.getProductsOffer().subscribe(response => {

      this.listProducts.set(response.data);
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
