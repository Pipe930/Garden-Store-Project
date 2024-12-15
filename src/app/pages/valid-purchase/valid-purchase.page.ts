import { Component, inject, OnInit, signal } from '@angular/core';
import {
  IonContent,

} from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { PurchasesUserService } from 'src/app/core/services/purchases-user.service';
import { HeaderComponent } from 'src/app/shared/header/header.component';

@Component({
  selector: 'app-valid-purchase',
  templateUrl: './valid-purchase.page.html',
  styleUrls: ['./valid-purchase.page.scss'],
  standalone: true,
  imports: [
    HeaderComponent,
    IonContent
  ]
})
export class ValidPurchasePage implements OnInit {

  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly purchaseService = inject(PurchasesUserService);

  private idSale = signal<string>(this.activatedRoute.snapshot.params["id"]);

  ngOnInit() {
    this.purchaseService.getPurchase(this.idSale()).subscribe(response => {
      console.log(response.data);
    });
  }

}
