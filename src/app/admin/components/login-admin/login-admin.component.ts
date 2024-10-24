import { NgClass } from '@angular/common';
import { Component, ElementRef, inject, signal, viewChildren } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { AlertService } from '@core/services/alert.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-login-admin',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, RouterLink],
  templateUrl: './login-admin.component.html',
  styleUrl: './login-admin.component.scss'
})
export class LoginAdminComponent {

  private readonly _builder = inject(FormBuilder);
  private readonly _router = inject(Router);
  private readonly _authService = inject(AuthService);
  private readonly _alertService = inject(AlertService);

  public otpArray = signal<string[]>(new Array(6).fill(''));
  public inputsList = viewChildren<ElementRef>('otpDigit');
  private idUser = 0;

  public formLoginAdmin: FormGroup = this._builder.group({
    email: this._builder.control('', [Validators.required, Validators.email, Validators.maxLength(255)]),
    password: this._builder.control('', [Validators.required, Validators.minLength(6), Validators.maxLength(50)])
  });

  public loginAdmin(): void {

    if (this.formLoginAdmin.invalid) {

      this.formLoginAdmin.markAllAsTouched();
      return;
    }

    this._authService.loginAdmin(this.formLoginAdmin.value).pipe(
      catchError((error) => {

        this._alertService.error("Error al iniciar sesión", error.error.message);

        return of();
      })
    ).subscribe(result => {

      this.idUser = result.data.idUser;
    });
  }

  public sendOTP(): void {

    const otp = this.otpArray().join('');

    if(otp.length < 6) {

      this._alertService.error('Error al verificar', 'El código debe tener 6 dígitos');
      return;
    }

    const verifyOtp = { otp, idUser: this.idUser };

    this._authService.verifyOTP(verifyOtp).pipe(
      catchError((error) => {

        this._alertService.error("Error al verificar", error.error.message);

        return of();
      })
    ).subscribe(result => {

      this._alertService.success("Verificación exitosa", "La verifucación ha sido exitosa");
      this._router.navigate(['/admin/dashboard']);
    });
  }

  onInput(event: Event, index: number) {
    const target = event.target as HTMLInputElement;

    this.otpArray.update(value => {
      value[index] = target.value;
      return value;
    });

    if (target.value.length === 1 && index < this.otpArray().length - 1) {
      this.moveToNextInput(index);
    }
  }

  onKeydown(event: KeyboardEvent, index: number) {
    const key = event.key;

    if (key === 'Backspace' && index > 0) {
      setTimeout(() => this.moveToPreviousInput(index), 10)
    } else if (key !== 'Backspace' && (key < '0' || key > '9')) {
      event.preventDefault();
    }
  }

  moveToNextInput(index: number) {

    const nextInput = this.inputsList()[index + 1].nativeElement;
    if (nextInput) {
      nextInput.focus();
    }
  }

  moveToPreviousInput(index: number) {

    const previousInput = this.inputsList()[index - 1].nativeElement;
    if (previousInput) {
      previousInput.focus();
    }
  }

  get email() {
    return this.formLoginAdmin.controls["email"];
  }

  get password() {
    return this.formLoginAdmin.controls["password"];
  }
}
