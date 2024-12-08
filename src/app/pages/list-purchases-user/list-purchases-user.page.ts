import { DatePipe, DecimalPipe, NgClass, TitleCasePipe } from '@angular/common';
import { HttpStatusCode } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonRow
} from '@ionic/angular/standalone';
import { StatusPayment } from 'src/app/core/enums/statusPayment.enum';
import { Purchase } from 'src/app/core/interfaces/purchase';
import { PurchasesUserService } from 'src/app/core/services/purchases-user.service';
import { HeaderComponent } from 'src/app/shared/header/header.component';

@Component({
  selector: 'app-list-purchases-user',
  templateUrl: './list-purchases-user.page.html',
  styleUrls: ['./list-purchases-user.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonNote,
    IonIcon,
    IonList,
    IonItem,
    IonLabel,
    IonRow,
    IonCol,
    IonButton,
    HeaderComponent,
    DatePipe,
    DecimalPipe,
    NgClass,
    TitleCasePipe,
    RouterLink
  ]
})
export class ListPurchasesUserPage implements OnInit {

  private readonly purhcasesUserService = inject(PurchasesUserService);

  public listPurchases = signal<Purchase[]>([]);

  ngOnInit(): void {

    this.purhcasesUserService.getPurchasesUser().subscribe(response => {
      if(response.statusCode === HttpStatusCode.Ok) this.listPurchases.set(response.data);
    })
  }

  getStatusClass(status: string): string {
    switch (status) {
      case StatusPayment.PAID:
        return 'text-success';
      case StatusPayment.PENDING:
        return 'text-warning';
      case StatusPayment.CANCELED:
        return 'text-danger';
      default:
        return 'text-muted';
    }
  }

}
