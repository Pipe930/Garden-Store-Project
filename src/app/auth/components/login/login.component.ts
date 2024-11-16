import { Component, ElementRef, inject, Renderer2, signal, viewChild, viewChildren } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { NgClass } from '@angular/common';
import { AlertService } from '@core/services/alert.service';
import { catchError, EMPTY, of } from 'rxjs';
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
  private readonly _renderer = inject(Renderer2);

  public activateMessage = signal<boolean>(false);
  public message = signal<string>('');
  public otpArray = signal<string[]>(new Array(6).fill(''));
  public inputsList = viewChildren<ElementRef>('otpDigit');
  public modalOPT = viewChild.required<ElementRef>('OPTModal');
  private idUser = 0;

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
          this.message.set(error.error.message);

          const timer = setTimeout(() => {
            this.activateMessage.set(false);
          }, 5000);
          clearTimeout(timer);

          return EMPTY;
        }

        return EMPTY
      })
    ).subscribe(result => {

      if("idUser" in result.data){
        this.idUser = result.data.idUser;
        this._alertService.info("Verificación de cuenta", "Como eres usuario administrador, te enviamos un correo con un codigo de verificación a tu correo");
        this.openModal();
        return;
      }

      this._authService.getRolesUser().subscribe((response) => {
        sessionStorage.setItem('roles', JSON.stringify(response.data));
      });

      this._alertService.success("Inicio de sesion exitoso", "Bienvenido");
      this._router.navigate(['/']);
    })
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

        return EMPTY;
      })
    ).subscribe(() => {

      this._alertService.success("Verificación exitosa", "La verifucación ha sido exitosa");
      this._authService.getRolesUser().subscribe((response) => {
        sessionStorage.setItem('roles', JSON.stringify(response.data));
      });
      this._router.navigate(['/admin/dashboard']);
    });
  }

  public resendOTP(): void {

    this._authService.resendOTP({ idUser: this.idUser }).pipe(
      catchError(() => {
          this._alertService.error("Error al reenviar", "No se ha podido reenviar el código de verificación");
          return EMPTY;
      })
    ).subscribe(() => {
        this._alertService.success("Código reenviado", "Se ha reenviado un código de verificación a tu correo");
    })
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

  openModal() {
    const modalElement = this.modalOPT().nativeElement;
    this._renderer.addClass(modalElement, 'show');
    this._renderer.setStyle(modalElement, 'display', 'block');
    this._renderer.setStyle(modalElement, 'backgroundColor', 'rgba(0, 0, 0, 0.5)');
  }

  closeModal() {
    const modalElement = this.modalOPT().nativeElement;
    this._renderer.removeClass(modalElement, 'show');
    this._renderer.setStyle(modalElement, 'display', 'none');
  }

  get email(){
    return this.formLogin.controls["email"];
  }

  get password(){
    return this.formLogin.controls["password"];
  }
}
