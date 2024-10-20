import { OfferService } from '@admin/services/offer.service';
import { NgClass } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AlertService } from '@core/services/alert.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-create-offer',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgClass],
  templateUrl: './create-offer.component.html',
  styleUrl: './create-offer.component.scss'
})
export class CreateOfferComponent implements OnInit {

  private readonly _offerService = inject(OfferService);
  private readonly _router = inject(Router);
  private readonly _alertService = inject(AlertService);
  private readonly _builder = inject(FormBuilder);

  public dateTomorrow = signal<string>("");

  public createOfferForm: FormGroup = this._builder.group({
    title: this._builder.control('', [Validators.required, Validators.minLength(4), Validators.maxLength(100)]),
    endDate: this._builder.control('', Validators.required),
    discount: this._builder.control(1, [Validators.required, Validators.min(1), Validators.max(100)]),
    description: this._builder.control('', Validators.maxLength(255)),
  });

  ngOnInit(): void {
    const today = new Date().getDate();
    const tomorrow = new Date();
    tomorrow.setDate(today + 1);
    let tomorrowFormatted = tomorrow.toISOString().split('T')[0];
    this.dateTomorrow.set(tomorrowFormatted);
  }

  public createOffer(): void {
    if(this.createOfferForm.invalid){
      this.createOfferForm.markAllAsTouched();
      return;
    }

    this._offerService.createOffer(this.createOfferForm.value).pipe(
      catchError(error => {
        this._alertService.error("Error", "Ha ocurrido un error al crear la oferta");
        return of();
      })
    ).subscribe(() => {
      this._alertService.success("Oferta creada", "La oferta ha sido creada correctamente");
      this._router.navigate(['/admin/offers/list']);
    });
  }

  get title() {
    return this.createOfferForm.controls["title"];
  }

  get endDate() {
    return this.createOfferForm.controls["endDate"];
  }

  get discount() {
    return this.createOfferForm.controls["discount"];
  }

  get description() {
    return this.createOfferForm.controls["description"];
  }
}
