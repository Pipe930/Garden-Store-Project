import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { NgClass } from '@angular/common';
import { AlertService } from '@core/services/alert.service';
import { catchError, of } from 'rxjs';
import { HttpStatusCode } from '@angular/common/http';

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
  private readonly _alertService = inject(AlertService);

  public activateMessage = signal<boolean>(false);

  public formLogin: FormGroup = this._builder.group({
    email: this._builder.control("", [Validators.required, Validators.email, Validators.maxLength(255)]),
    password: this._builder.control("", [Validators.required, Validators.minLength(8), Validators.maxLength(50)])
  })

  public login(): void {

    if(this.formLogin.invalid){

      this.formLogin.markAllAsTouched();
      return;
    }

    this._authService.login(this.formLogin.value).pipe(

      catchError((error) => {

        if(error.error.statusCode === HttpStatusCode.Unauthorized){

          this.activateMessage.set(true);

          setTimeout(() => {
            this.activateMessage.set(false);
          }, 5000);
          return of()
        }

        return of()
      })
    ).subscribe(result => {

      this._alertService.success("Inicio de sesion exitoso", "Bienvenido");
      this._router.navigate(['/']);
    })
  }

  get email(){
    return this.formLogin.controls["email"];
  }

  get password(){
    return this.formLogin.controls["password"];
  }
}
