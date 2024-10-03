import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forgot-password-confirm',
  standalone: true,
  imports: [NgClass, ReactiveFormsModule],
  templateUrl: './forgot-password-confirm.component.html',
  styleUrl: './forgot-password-confirm.component.scss'
})
export class ForgotPasswordConfirmComponent implements OnInit {

  private uuid: string = "";
  private token: string = "";

  private readonly _router = inject(Router);
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _authService = inject(AuthService);
  private readonly _builder = inject(FormBuilder);

  public formForgotPasswordConfirm: FormGroup = this._builder.group({
    newPassword: this._builder.control("", [Validators.required, Validators.minLength(8), Validators.maxLength(50)]),
    newRePassword: this._builder.control("", [Validators.required, Validators.minLength(8), Validators.maxLength(50)])
  });

  ngOnInit(): void {

    this._activatedRoute.params.subscribe(params => {

      this.uuid = params["uuid"];
      this.token = params["token"];
    })
  }

  public forgotPasswordConfirm(): void {

    if(this.formForgotPasswordConfirm.invalid){

      this.formForgotPasswordConfirm.markAllAsTouched();
      return;
    }

    this._authService.forgotPasswordConfirm({
      uuid: this.uuid,
      token: this.token,
      ...this.formForgotPasswordConfirm.value
    }).subscribe(
      (result) => {

        this._router.navigate(["auth/login"]);
        Swal.fire({
          icon: "success",
          title: "Recuperación de contraseña",
          text: "Contraseña cambiada con exito"
        })
      },
      (error) => {

        Swal.fire({

          icon: "error",
          title: "Recuperación de contraseña",
          text: "Ocurrio un error al cambiar la contraseña"
        })
      }
    )
  }

  get newPassword(){
    return this.formForgotPasswordConfirm.controls["newPassword"];
  }

  get newRePassword(){
    return this.formForgotPasswordConfirm.controls["newRePassword"];
  }
}
