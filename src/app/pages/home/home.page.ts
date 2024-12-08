import { DecimalPipe, TitleCasePipe } from '@angular/common';
import { HttpStatusCode } from '@angular/common/http';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit, signal } from '@angular/core';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonImg,
  IonCard,
  IonRow,
  IonGrid,
  IonCol,
  IonCardContent,

} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { construct, helpCircle, leaf } from 'ionicons/icons';
import { Images, Product } from 'src/app/core/interfaces/product';
import { ProductService } from 'src/app/core/services/product.service';
import { environment } from 'src/environments/environment';
import { register } from 'swiper/element/bundle';

register();

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonTitle,
    IonContent,
    IonImg,
    IonCard,
    IonRow,
    IonGrid,
    IonCol,
    IonCardContent,
    TitleCasePipe,
    DecimalPipe
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePage implements OnInit {

  private readonly productsService = inject(ProductService);

  public listFeaturedProducts = signal<Product[]>([]);
  public urlImage = signal<string>(environment.apiImages);

  public featuredProducts = [
    {
      name: 'Maceta Decorativa',
      price: '$20.000',
      image: 'assets/images/pot.jpg',
    },
    {
      name: 'Kit de Jardinería',
      price: '$35.000',
      image: 'assets/images/gardening-kit.jpg',
    },
    {
      name: 'Planta de Interior',
      price: '$15.000',
      image: 'assets/images/indoor-plant.jpg',
    },
    {
      name: 'Fertilizante Orgánico',
      price: '$10.000',
      image: 'assets/images/fertilizer.jpg',
    },
  ];

  public services = [
    {
      name: 'Diseño de Jardines',
      description: 'Transformamos tu espacio exterior en un oasis.',
      icon: 'leaf',
    },
    {
      name: 'Mantenimiento',
      description: 'Cuidado profesional para tus plantas y jardín.',
      icon: 'construct',
    },
    {
      name: 'Asesoría',
      description: 'Te ayudamos a elegir las plantas perfectas.',
      icon: 'help-circle',
    },
  ];

  constructor() {
    addIcons({
      leaf,
      construct,
      helpCircle
    })
  }

  ngOnInit() {

    this.productsService.getFeaturedProducts().subscribe(response => {
      if(response.statusCode === HttpStatusCode.Ok) this.listFeaturedProducts.set(response.data);
    });
  }

  public getImageProduct(images: Images[]): string {

    if(images.length !== 0)
      return images.filter((image) => image.type === 'cover')[0].urlImage
    else return "";
  }

}
