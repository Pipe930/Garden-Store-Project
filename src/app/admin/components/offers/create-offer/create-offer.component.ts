import { OfferService } from '@admin/services/offer.service';
import { NgClass } from '@angular/common';
import { Component, inject, input, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AlertService } from '@core/services/alert.service';
import { catchError, EMPTY, of } from 'rxjs';

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
  public selectDate = signal<string>("");

  public createOfferForm: FormGroup = this._builder.group({
    title: this._builder.control('', [Validators.required, Validators.minLength(4), Validators.maxLength(100)]),
    startDate: this._builder.control('', Validators.required),
    endDate: this._builder.control('', Validators.required),
    discount: this._builder.control(1, [Validators.required, Validators.min(1), Validators.max(100)]),
    description: this._builder.control('', Validators.maxLength(255)),
  });

  ngOnInit(): void {

    const tomorrow = new Date();
    tomorrow.setDate(new Date().getDate() + 1);

    this.dateTomorrow.set(tomorrow.toISOString().split('T')[0]);
    this.createOfferForm.get('endDate')?.disable();
  }

  public selectStartDate(event: Event): void {

    const input = event.target as HTMLInputElement;

    const tomorrow = new Date(input.value);
    tomorrow.setDate(new Date(input.value).getDate() + 1);

    this.selectDate.set(tomorrow.toISOString().split('T')[0]);
    this.createOfferForm.get('endDate')?.enable();
  }

  public createOffer(): void {
    if(this.createOfferForm.invalid){
      this.createOfferForm.markAllAsTouched();
      return;
    }

    this._offerService.createOffer(this.createOfferForm.value).pipe(
      catchError(() => {
        this._alertService.error("Error", "Ha ocurrido un error al crear la oferta");
        return EMPTY;
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
