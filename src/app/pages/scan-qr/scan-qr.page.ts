import { Component, inject, OnInit, signal } from '@angular/core';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonText,
  ModalController,
  Platform
} from '@ionic/angular/standalone';
import { HeaderComponent } from 'src/app/shared/header/header.component';
import { addIcons } from 'ionicons';
import { qrCode, scan } from 'ionicons/icons';
import { BarcodeScanningModalComponent } from './barcode-scanning-modal.component';
import { BarcodeScanner, LensFacing } from '@capacitor-mlkit/barcode-scanning';

@Component({
  selector: 'app-scan-qr',
  templateUrl: './scan-qr.page.html',
  styleUrls: ['./scan-qr.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    HeaderComponent,
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonCardSubtitle,
    IonCardTitle,
    IonText,
    IonButton,
    IonItem,
    IonLabel,
    IonIcon
  ]
})
export class ScanQrPage implements OnInit {

  public resultScan = signal<string>("");
  private readonly modalController = inject(ModalController);
  private readonly platform = inject(Platform);

  constructor(){
    addIcons({
      scan,
      qrCode
    })
  }

  async ngOnInit(): Promise<void> {

    if(this.platform.is('capacitor')){

      await BarcodeScanner.isSupported();
      await BarcodeScanner.checkPermissions();
      await BarcodeScanner.removeAllListeners();
    }
  }

  public async startScan() {


    const modal = await this.modalController.create({
      component: BarcodeScanningModalComponent,
      cssClass: 'barcode-scanning-modal',
      showBackdrop: false,
      componentProps: {
        formats: [],
        lensFacing: LensFacing.Back
      }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();

    if(data){
      this.resultScan.set(data?.barcode?.displayValue);
    }
  }

}
