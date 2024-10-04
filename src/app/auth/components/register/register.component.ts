import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthService } from '../../services/auth.service';
import { NgClass } from '@angular/common';
import { AlertService } from '../../../core/services/alert.service';
import { ValidatorService } from '../../../core/services/validator.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, NgClass],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  private readonly _router = inject(Router);
  private readonly _builder = inject(FormBuilder);
  private readonly _authService = inject(AuthService);
  private readonly _alertService = inject(AlertService);
  private readonly _validatorService = inject(ValidatorService)

  public formRegister: FormGroup = this._builder.group({

    firstName: this._builder.control("", [Validators.maxLength(20)]),
    lastName: this._builder.control("", [Validators.maxLength(20)]),
    email: this._builder.control("", [Validators.required, Validators.email, Validators.maxLength(255)]),
    phone: this._builder.control("", [Validators.required, Validators.minLength(8), Validators.maxLength(8)]),
    password: this._builder.control("", [Validators.required, Validators.minLength(8), Validators.maxLength(50)]),
    rePassword: this._builder.control("", [Validators.required, Validators.minLength(8), Validators.maxLength(50)])
  }, {
    validators: [this._validatorService.comparePasswords("password", "rePassword")]
  });

  public register(): void {

    if(this.formRegister.invalid){

      this.formRegister.markAllAsTouched();
      return;
    }

    this.formRegister.value.phone = `+569${this.formRegister.value.phone}`;

    console.log(this.formRegister.value.phone.length);

    this._authService.register(this.formRegister.value).subscribe(
    (result) => {

      this._router.navigate(["auth/login"]);
      this._alertService.success("Registro exitoso", "Tu cuenta a sido registrada con exito, te enviamos un correo para que envies tu cuenta");
    },
    (error) => {

      if(error.error.statusCode === 400){

        this._alertService.error("Error en el registro", error.error.message);
        return;
      }

      this._alertService.error("Error en el registro", "No se pudo registrar tu cuenta, intenta de nuevo");
    })
  }

  get firstName(){
    return this.formRegister.controls["firstName"];
  }

  get lastName(){
    return this.formRegister.controls["lastName"];
  }

  get phone(){
    return this.formRegister.controls["phone"];
  }

  get email(){
    return this.formRegister.controls["email"];
  }

  get password(){
    return this.formRegister.controls["password"];
  }

  get rePassword(){
    return this.formRegister.controls["rePassword"];
  }
}
