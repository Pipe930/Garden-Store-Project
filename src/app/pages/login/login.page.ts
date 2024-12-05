import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  ToastController,
  IonButtons,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonInput,
  IonNote,
  IonInputPasswordToggle,
  IonText,
  IonBackButton,
  AlertController
} from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { catchError, EMPTY } from 'rxjs';
import { HttpStatusCode } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    ReactiveFormsModule,
    IonButtons,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonInput,
    IonNote,
    IonInputPasswordToggle,
    IonText,
    RouterLink,
    IonBackButton
  ]
})
export class LoginPage {

  private readonly builder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly toastController = inject(ToastController);
  private readonly alertController = inject(AlertController);
  private readonly authService = inject(AuthService);

  public loginForm: FormGroup = this.builder.group({
    email: this.builder.control('', [Validators.required, Validators.email, Validators.maxLength(255)]),
    password: this.builder.control('', [Validators.required, Validators.minLength(8), Validators.maxLength(50)]),
  });

  public login(): void {

    if(this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.authService.login(this.loginForm.value).pipe(
      catchError((error) => {

        if(error.status === HttpStatusCode.Unauthorized){
          this.presentAlert("Ocurrio un error", error.error.message);
          return EMPTY;
        };

        this.showToast('Error al iniciar sesión', 'danger');
        throw EMPTY;
      })
    ).subscribe(async (response) => {

      if(response.statusCode === HttpStatusCode.Ok){
        await this.showToast('Inicio de sesión exitoso', 'primary');
        this.loginForm.reset();
        this.router.navigate(['/home']);
      }
    })
  }

  recoverPassword() {
    console.log('Redirecting to password recovery...');
  }

  private async presentAlert(title: string, message: string) {
    const alert = await this.alertController.create({
      header: title,
      message,
      buttons: ['Aceptar'],
    });

    await alert.present();
  }

  private async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'bottom',
      color,
    });
    await toast.present();
  }

  get email() {
    return this.loginForm.controls["email"];
  }

  get password() {
    return this.loginForm.controls["password"];
  }
}
