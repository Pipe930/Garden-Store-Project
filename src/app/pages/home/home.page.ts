import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonMenuButton,

} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { construct, helpCircle, leaf } from 'ionicons/icons';
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
    IonContent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePage implements OnInit {
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
  }

}
