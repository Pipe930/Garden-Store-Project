import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { HeaderComponent } from 'src/app/shared/header/header.component';

@Component({
  selector: 'app-list-products-offer',
  templateUrl: './list-products-offer.page.html',
  styleUrls: ['./list-products-offer.page.scss'],
  standalone: true,
  imports: [IonContent, HeaderComponent]
})
export class ListProductsOfferPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
