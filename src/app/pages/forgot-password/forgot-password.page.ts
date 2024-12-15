import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  AlertController,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonInput,
  IonText
} from '@ionic/angular/standalone';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { HeaderComponent } from 'src/app/shared/header/header.component';
import { catchError, EMPTY } from 'rxjs';
import { HttpStatusCode } from '@angular/common/http';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HeaderComponent,
    IonContent,
    IonInput,
    IonText,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle
  ]
})
export class ForgotPasswordPage implements OnInit {

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly builder = inject(FormBuilder);
  private readonly alertController = inject(AlertController);

  public forgotPasswordForm: FormGroup = this.builder.group({
    email: this.builder.control("", [Validators.required, Validators.email, Validators.maxLength(255)])
  })

  ngOnInit() {

  }

  public forgotPassword(): void {

    if(this.forgotPasswordForm.invalid){
      this.forgotPasswordForm.markAllAsTouched();
      return;
    }

    this.authService.forgotPassword(this.forgotPasswordForm.value).pipe(
      catchError((error) => {

        if(error.error.statusCode === HttpStatusCode.NotFound){

          this.presentAlert("Ocurrio un Error", error.error.message);
          return EMPTY;
        }

        return EMPTY;
      })
    ).subscribe(() => {

      this.presentAlert("Recuperar Contraseña", "Se envio un email al correo ingresado para recuperar tu contraseña");
      this.router.navigate(["/login"]);
    })
  }

  private async presentAlert(title: string, message: string) {
    const alert = await this.alertController.create({
      header: title,
      message,
      buttons: ['Aceptar'],
    });

    await alert.present();
  }

  get email(){
    return this.forgotPasswordForm.controls["email"]
  }

}
