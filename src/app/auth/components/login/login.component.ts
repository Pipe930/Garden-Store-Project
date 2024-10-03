import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, NgClass],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  private readonly _router = inject(Router);
  private readonly _builder = inject(FormBuilder);
  private readonly _authService = inject(AuthService);

  public formLogin: FormGroup = this._builder.group({
    email: this._builder.control("", [Validators.required, Validators.email, Validators.maxLength(255)]),
    password: this._builder.control("", [Validators.required, Validators.minLength(8), Validators.maxLength(50)])
  })

  public login(): void {

    if(this.formLogin.invalid){

      this.formLogin.markAllAsTouched();
      return;
    }

    this._authService.login(this.formLogin.value).subscribe(result => {

      Swal.fire({
        icon: 'success',
        title: 'Se inicio sesion correctamente',
        text: "Bienvenido "
      })
      // this._router.navigate(['/home']);
    }, error => {

      if(error.error.statusCode === 401){

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.error.message
        })
      }
    })
  }

  get email(){
    return this.formLogin.controls["email"];
  }

  get password(){
    return this.formLogin.controls["password"];
  }
}
