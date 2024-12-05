import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  ToastController,
  AlertController,
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
  IonBackButton
} from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { catchError, EMPTY } from 'rxjs';
import { HttpStatusCode } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
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
    ReactiveFormsModule,
    RouterLink
  ]
})
export class RegisterPage {

  private readonly builder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly alertController = inject(AlertController);
  private readonly toastController = inject(ToastController);

  public createUserForm: FormGroup = this.builder.group({
    firstName: this.builder.control('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
    lastName: this.builder.control('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
    email: this.builder.control('', [Validators.required, Validators.email, Validators.maxLength(255)]),
    phone: this.builder.control('', [Validators.required, Validators.pattern(/^\+569\d{8}$/)]),
    password: this.builder.control('', [Validators.required, Validators.minLength(8), Validators.maxLength(50)]),
    rePassword: this.builder.control('', [Validators.required, Validators.minLength(8), Validators.maxLength(50)]),
  });

  public register(): void {

    if (this.createUserForm.invalid) {
      this.createUserForm.markAllAsTouched();
      return;
    }

    this.authService.register(this.createUserForm.value).pipe(
      catchError(async (error) => {

        await this.presentAlert(error.error.message);
        return EMPTY;
      })
    ).subscribe(async (response) => {

      if(response.statusCode === HttpStatusCode.Ok){
        await this.showToast('Usuario creado correctamente');
        this.createUserForm.reset();
        this.router.navigate(['login']);
      }
    });
  }

  private async presentAlert(message: string) {

    const alert = await this.alertController.create({
      header: 'Ocurrio un Error',
      message,
      buttons: ['Aceptar'],
    });

    await alert.present();
  }

  private async showToast(message: string) {

    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'bottom',
      color: 'primary',
      icon: 'checkmark-circle-outline',
    });
    await toast.present();
  }

  get firstName() {
    return this.createUserForm.controls["firstName"];
  }

  get lastName() {
    return this.createUserForm.controls["lastName"];
  }

  get email() {
    return this.createUserForm.controls["email"];
  }

  get phone() {
    return this.createUserForm.controls["phone"];
  }

  get password() {
    return this.createUserForm.controls["password"];
  }

  get rePassword() {
    return this.createUserForm.controls["rePassword"];
  }
}
