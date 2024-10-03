import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthService } from '../../services/auth.service';
import { NgClass } from '@angular/common';
import Swal from 'sweetalert2';
import { catchError, Observable } from 'rxjs';

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

  public formRegister: FormGroup = this._builder.group({

    firstName: this._builder.control("", [Validators.maxLength(20)]),
    lastName: this._builder.control("", [Validators.maxLength(20)]),
    email: this._builder.control("", [Validators.required, Validators.email, Validators.maxLength(255)]),
    phone: this._builder.control("", [Validators.required, Validators.minLength(12), Validators.maxLength(12)]),
    password: this._builder.control("", [Validators.required, Validators.minLength(8), Validators.maxLength(50)]),
    rePassword: this._builder.control("", [Validators.required, Validators.minLength(8), Validators.maxLength(50)])
  });

  public register(): void {

    if(this.formRegister.invalid){

      this.formRegister.markAllAsTouched();
      return;
    }

    this._authService.register(this.formRegister.value).subscribe(
    (result) => {

      this._router.navigate(["auth/login"]);
      Swal.fire({
        icon: "success",
        title: "Registro exitoso",
        text: "Tu cuenta a sido registrada con exito, te enviamos un correo para que envies tu cuenta"
      })
    },
    (error) => {

      if(error.error.statusCode === 400){

        Swal.fire({
          icon: "error",
          title: "Error en el registro",
          text: error.error.message
        })
        return;
      }
      Swal.fire({
        icon: "error",
        title: "Error en el registro",
        text: "No se pudo registrar tu cuenta, intenta de nuevo"
      })
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
