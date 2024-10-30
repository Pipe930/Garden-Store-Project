import { Offer, offerJson } from '@admin/interfaces/offer';
import { OfferService } from '@admin/services/offer.service';
import { NgClass } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AlertService } from '@core/services/alert.service';

@Component({
  selector: 'app-update-offer',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, RouterLink],
  templateUrl: './update-offer.component.html',
  styleUrl: './update-offer.component.scss'
})
export class UpdateOfferComponent implements OnInit {

  private readonly _builder = inject(FormBuilder);
  private readonly _offerService = inject(OfferService);
  private readonly _alertService = inject(AlertService);
  private readonly _router = inject(Router);
  private readonly _activatedRoute = inject(ActivatedRoute);

  public offer = signal<Offer>(offerJson);
  private idOffer = this._activatedRoute.snapshot.params["id"];
  public dateTomorrow = signal<string>("");

  public updateOfferForm: FormGroup = this._builder.group({
    title: this._builder.control('', [Validators.required, Validators.minLength(4), Validators.maxLength(255)]),
    endDate: this._builder.control('', Validators.required),
    discount: this._builder.control(0, [Validators.required, Validators.min(1), Validators.max(100)]),
    description: this._builder.control('', Validators.maxLength(255)),
  });

  ngOnInit(): void {

    const today = new Date().getDate();
    const tomorrow = new Date();
    tomorrow.setDate(today + 1);
    let tomorrowFormatted = tomorrow.toISOString().split('T')[0];
    this.dateTomorrow.set(tomorrowFormatted);

    this._offerService.getOffer(this.idOffer).subscribe(response => {

      this.offer.set(response.data);
      this.updateOfferForm.get("title")?.setValue(response.data.title);
      this.updateOfferForm.get("endDate")?.setValue(new Date(response.data.endDate).toISOString().split('T')[0]);
      this.updateOfferForm.get("discount")?.setValue(response.data.discount);
      this.updateOfferForm.get("description")?.setValue(response.data.description);
      this.updateOfferForm.updateValueAndValidity();
    });
  }

  public updateOffer(): void {

    if(this.updateOfferForm.invalid){
      this.updateOfferForm.markAllAsTouched();
      return;
    }

    this._offerService.updateOffer(this.idOffer, this.updateOfferForm.value).subscribe(() => {
      this._alertService.success("Oferta actualizada", "La oferta ha sido actualizada correctamente");
      this._router.navigate(["/admin/offers/list"]);
    });
  }

  get title() {
    return this.updateOfferForm.controls["title"];
  }

  get endDate() {
    return this.updateOfferForm.controls["endDate"];
  }

  get discount() {
    return this.updateOfferForm.controls["discount"];
  }

  get description() {
    return this.updateOfferForm.controls["description"];
  }
}
