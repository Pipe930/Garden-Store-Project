import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { NgClass } from '@angular/common';
import { AlertService } from '@core/services/alert.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgClass],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {

  private readonly _router = inject(Router);
  private readonly _builder = inject(FormBuilder);
  private readonly _authService = inject(AuthService);
  private readonly _alertService = inject(AlertService);

  public formForgotPassword: FormGroup = this._builder.group({
    email: this._builder.control("", [Validators.required, Validators.email, Validators.maxLength(255)])
  });

  public sendEmail():void {

    if(this.formForgotPassword.invalid){

      this.formForgotPassword.markAllAsTouched();
      return;
    }

    this._authService.forgotPassword(this.formForgotPassword.value).subscribe(
      (result) => {

        this._alertService.success("Recuperación de contraseña", "Se ha enviado un correo para recuperar tu contraseña");
        this._router.navigate(["auth/login"]);
      },
      (error) => {

        if(error.error.statusCode === 400){

          this._alertService.error("Error en la recuperación de contraseña", error.error.message);
          return;
        }

        if(error.error.statusCode === 404){

          this._alertService.error("Error en la recuperación de contraseña", "El correo ingresado no se encuentra registrado en nuestro sistema");
          return;
        }
      }
    )
  }

  get email() {
    return this.formForgotPassword.controls['email'];
  }

}
