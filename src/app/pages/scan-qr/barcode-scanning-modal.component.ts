import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  input,
  NgZone,
  OnDestroy,
  OnInit,
  signal,
  viewChild
} from '@angular/core';
import {
  Barcode,
  BarcodeFormat,
  BarcodeScanner,
  LensFacing,
  StartScanOptions,
} from '@capacitor-mlkit/barcode-scanning';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonToolbar,
  ModalController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { flashlight } from 'ionicons/icons';


@Component({
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonContent,
    IonFab,
    IonFabButton
  ],
  selector: 'app-barcode-scanning',
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar color="tertiary">
        <ion-buttons slot="end">
          <ion-button (click)="closeModal()">
            <ion-icon name="close"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div #square class="square"></div>

      @if(isTorchAvailable()){
        <ion-fab
          slot="fixed"
          horizontal="end"
          vertical="bottom"
        >
          <ion-fab-button (click)="toggleTorch()">
            <ion-icon name="flashlight"></ion-icon>
          </ion-fab-button>
        </ion-fab>
      }
    </ion-content>
  `,
  standalone: true,
  styles: [
    `
      ion-content {
        --background: transparent;
      }

      .square {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        border-radius: 16px;
        width: 200px;
        height: 200px;
        border: 6px solid white;
        box-shadow: 0 0 0 4000px rgba(0, 0, 0, 0.3);
      }
    `,
  ],
})
export class BarcodeScanningModalComponent implements OnInit, AfterViewInit, OnDestroy {

  private readonly ngZone = inject(NgZone);
  private readonly modalController = inject(ModalController);

  public formats = input<BarcodeFormat[]>([]);
  public lensFacing = input<LensFacing>(LensFacing.Back);

  public squareElement = viewChild.required<ElementRef<HTMLDivElement>>('square');

  public isTorchAvailable = signal<boolean>(false);

  constructor() {
    addIcons({
      flashlight
    })
  }

  public ngOnInit(): void {
    BarcodeScanner.isTorchAvailable().then((result) => {
      this.isTorchAvailable.set(result.available);
    });
  }

  public ngAfterViewInit(): void {
    setTimeout(() => {
      this.startScan();
    }, 250);
  }

  public ngOnDestroy(): void {
    this.stopScan();
  }

  public async closeModal(barcode?: Barcode): Promise<void> {
    this.modalController.dismiss({ barcode });
  }

  public async toggleTorch(): Promise<void> {
    await BarcodeScanner.toggleTorch();
  }

  private async startScan(): Promise<void> {
    // Hide everything behind the modal (see `src/theme/variables.scss`)
    document.querySelector('body')?.classList.add('barcode-scanning-active');

    const options: StartScanOptions = {
      formats: this.formats(),
      lensFacing: this.lensFacing(),
    };

    const squareElementBoundingClientRect =
      this.squareElement().nativeElement.getBoundingClientRect();
    const scaledRect = squareElementBoundingClientRect
      ? {
        left: squareElementBoundingClientRect.left * window.devicePixelRatio,
        right:
          squareElementBoundingClientRect.right * window.devicePixelRatio,
        top: squareElementBoundingClientRect.top * window.devicePixelRatio,
        bottom:
          squareElementBoundingClientRect.bottom * window.devicePixelRatio,
        width:
          squareElementBoundingClientRect.width * window.devicePixelRatio,
        height:
          squareElementBoundingClientRect.height * window.devicePixelRatio,
      }
      : undefined;
    const detectionCornerPoints = scaledRect
      ? [
        [scaledRect.left, scaledRect.top],
        [scaledRect.left + scaledRect.width, scaledRect.top],
        [
          scaledRect.left + scaledRect.width,
          scaledRect.top + scaledRect.height,
        ],
        [scaledRect.left, scaledRect.top + scaledRect.height],
      ]
      : undefined;
    const listener = await BarcodeScanner.addListener(
      'barcodeScanned',
      async (event) => {
        this.ngZone.run(() => {
          const cornerPoints = event.barcode.cornerPoints;
          if (detectionCornerPoints && cornerPoints) {
            if (
              detectionCornerPoints[0][0] > cornerPoints[0][0] ||
              detectionCornerPoints[0][1] > cornerPoints[0][1] ||
              detectionCornerPoints[1][0] < cornerPoints[1][0] ||
              detectionCornerPoints[1][1] > cornerPoints[1][1] ||
              detectionCornerPoints[2][0] < cornerPoints[2][0] ||
              detectionCornerPoints[2][1] < cornerPoints[2][1] ||
              detectionCornerPoints[3][0] > cornerPoints[3][0] ||
              detectionCornerPoints[3][1] < cornerPoints[3][1]
            ) {
              return;
            }
          }
          listener.remove();
          this.closeModal(event.barcode);
        });
      }
    );
    await BarcodeScanner.startScan(options);
  }

  private async stopScan(): Promise<void> {
    // Show everything behind the modal again
    document.querySelector('body')?.classList.remove('barcode-scanning-active');

    await BarcodeScanner.stopScan();
  }
}
