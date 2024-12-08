import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { PurchasesUserService } from 'src/app/core/services/purchases-user.service';

@Component({
  selector: 'app-valid-purchase',
  templateUrl: './valid-purchase.page.html',
  styleUrls: ['./valid-purchase.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar]
})
export class ValidPurchasePage implements OnInit {

  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly purchaseService = inject(PurchasesUserService);

  private idSale = signal<string>(this.activatedRoute.snapshot.params["id"]);

  constructor() { }

  ngOnInit() {
    this.purchaseService.getPurchase(this.idSale()).subscribe(response => {
      console.log(response.data);
    })
  }

}
