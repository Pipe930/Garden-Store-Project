import { Component, inject, OnInit } from '@angular/core';
import { QRCodeModule } from 'angularx-qrcode';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonText
} from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { HeaderComponent } from 'src/app/shared/header/header.component';

@Component({
  selector: 'app-generate-qr',
  templateUrl: './generate-qr.page.html',
  styleUrls: ['./generate-qr.page.scss'],
  standalone: true,
  imports: [
    HeaderComponent,
    QRCodeModule,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonText
  ]
})
export class GenerateQrPage implements OnInit {

  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly idSale = this.activatedRoute.snapshot.params['id'];

  ngOnInit() {
  }

  public generateUrl(): string {
    return `http://localhost:8100/validSale/${this.idSale}`;
  }


}
