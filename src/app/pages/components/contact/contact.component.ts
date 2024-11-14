import { NgClass, ViewportScroller } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from '@core/services/alert.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {

  private readonly _builder = inject(FormBuilder);
  // private readonly _pagesService = inject(PagesService);
  private readonly _alertService = inject(AlertService);
  private readonly _router = inject(Router);
  private readonly _viewportScroller = inject(ViewportScroller);

  public formContact: FormGroup = this._builder.group({
    full_name: this._builder.control("", [Validators.required, Validators.maxLength(40), Validators.minLength(4)]),
    email: this._builder.control("", [Validators.required, Validators.email, Validators.maxLength(255)]),
    message: this._builder.control("", Validators.maxLength(255))
  });

  ngOnInit(): void {
    this._viewportScroller.scrollToPosition([0, 0]);
  }

  public sendEmail():void{

    if(this.formContact.invalid){

      this.formContact.markAllAsTouched();
      return;
    }

    // this._pagesService.sendEmail(this.formContact.value).subscribe( (result) => {

    //   this._alertService.success("Correo Enviado", "El correo se a enviado correctamente, te atendermos tu problema");
    //   this._router.navigate(['/']);
    // }, (error) => this._alertService.error("Error Envio", "El correo no se a enviado correctamente"))
  }

  get full_name(){
    return this.formContact.controls["full_name"];
  }

  get email(){
    return this.formContact.controls["email"];
  }

  get message(){
    return this.formContact.controls["message"];
  }
}
