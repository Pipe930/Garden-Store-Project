import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { NgClass } from '@angular/common';

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

        this._router.navigate(["auth/login"]);
        Swal.fire({
          icon: "success",
          title: "Recuperación de contraseña",
          text: "Se ha enviado un correo para recuperar tu contraseña"
        })
      },
      (error) => {

        if(error.error.statusCode === 400){

          Swal.fire({
            icon: "error",
            title: "Error en la recuperación de contraseña",
            text: error.error.message
          })
          return;
        }

        if(error.error.statusCode === 404){

          Swal.fire({
            icon: "error",
            title: "Error en la recuperación de contraseña",
            text: "El correo ingresado no se encuentra registrado en nuestro sistema"
          })
          return;
        }
      }
    )
  }

  get email() {
    return this.formForgotPassword.controls['email'];
  }

}
