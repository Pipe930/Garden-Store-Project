import { Component, inject, OnInit, signal, viewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  callOutline,
  checkmarkCircle,
  cubeOutline,
  locationOutline,
  lockClosedOutline,
  logOutOutline
} from 'ionicons/icons';
import { ChangePassword, Profile, profileJson } from 'src/app/core/interfaces/profile';
import { AuthService } from 'src/app/core/services/auth.service';
import { HeaderComponent } from 'src/app/shared/header/header.component';
import { OverlayEventDetail } from '@ionic/core/components';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonContent,
  ToastController,
  IonModal,
  IonAvatar,
  IonImg,
  IonList,
  IonItem,
  IonIcon,
  IonText,
  IonLabel,
  IonButton,
  IonHeader,
  IonButtons,
  IonToolbar,
  IonInput,
  IonTitle,
  AlertController
} from '@ionic/angular/standalone';
import { catchError, EMPTY } from 'rxjs';
import { HttpStatusCode } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonAvatar,
    IonImg,
    IonList,
    IonItem,
    IonIcon,
    IonText,
    IonLabel,
    IonButton,
    IonModal,
    IonHeader,
    IonButtons,
    IonToolbar,
    IonInput,
    IonTitle,
    HeaderComponent,
    ReactiveFormsModule,
    RouterLink
  ]
})
export class ProfilePage implements OnInit {

  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly toastController = inject(ToastController);
  private readonly alertController = inject(AlertController);
  private readonly builder = inject(FormBuilder);

  public modalChangeProfile = viewChild.required<IonModal>('modalChangeProfile');
  public modalChangePassword = viewChild.required<IonModal>('modalChangePassword');

  public message = 'This modal example uses triggers to automatically open a modal when the button is clicked.';
  public name = "";

  public profile = signal<Profile>(profileJson);
  public updateProfileForm: FormGroup = this.builder.group({
    firstName: this.builder.control('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
    lastName: this.builder.control('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
    email: this.builder.control('', [Validators.required, Validators.email, Validators.maxLength(255)]),
    phone: this.builder.control('', [Validators.required, Validators.pattern(/^\+569\d{8}$/)])
  });

  public changePasswordForm: FormGroup = this.builder.group({
    currentPassword: this.builder.control('', [Validators.required, Validators.minLength(8), Validators.maxLength(50)]),
    newPassword: this.builder.control('', [Validators.required, Validators.minLength(8), Validators.maxLength(50)]),
    newConfirmPassword: this.builder.control('', [Validators.required, Validators.minLength(8), Validators.maxLength(50)])
  })

  user = {
    avatar: 'https://i.pravatar.cc/150?img=5',
    address: 'Av. Jardín 123, Santiago, Chile',
  };

  constructor() {
    addIcons({
      lockClosedOutline,
      logOutOutline,
      callOutline,
      locationOutline,
      cubeOutline,
      checkmarkCircle
    });
  }

  ngOnInit(): void {

    this.authService.profile();
    this.authService.userProfile$.subscribe(profile => {
      this.profile.set(profile);

      this.updateProfileForm.get('firstName')?.setValue(profile.firstName);
      this.updateProfileForm.get('lastName')?.setValue(profile.lastName);
      this.updateProfileForm.get('email')?.setValue(profile.email);
      this.updateProfileForm.get('phone')?.setValue(profile.phone);
    });
  }

  public editProfile() {

    if(this.updateProfileForm.invalid){
      this.updateProfileForm.markAllAsTouched();
      return;
    }

    this.authService.updateProfile(this.updateProfileForm.value).subscribe(() => {

      this.showToast('Perfil actualizado correctamente');
      this.modalChangeProfile().dismiss(this.name, 'confirm');
      this.authService.profile();
    });
  }

  public async changePassword(): Promise<void> {

    if(this.changePasswordForm.invalid){
      this.changePasswordForm.markAllAsTouched();
      return;
    }

    await this.changePasswordAlert();
  }

  public logout() {

    this.authService.logout().subscribe(() => {

      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');

      this.showToast('Sesión cerrada correctamente');
      this.router.navigate(['/home']);
    })
  }

  private async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'bottom',
      icon: 'checkmark-circle',
      color: 'success',
    });
    await toast.present();
  }

  private async changePasswordAlert() {

    const alert = await this.alertController.create({
      header: 'Cambiar Contraseña',
      message: 'Al cambiar tu contraseña se cerrara tu sesión actual, ¿estas seguro?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {},
        },
        {
          text: 'Confirmar',
          role: 'confirm',
          handler: () => {

            const changePasswordJson: ChangePassword = {
              oldPassword: this.changePasswordForm.value.currentPassword,
              newPassword: this.changePasswordForm.value.newPassword,
              newRePassword: this.changePasswordForm.value.newConfirmPassword
            }

            this.authService.changePassword(changePasswordJson).pipe(
              catchError(async (error) => {

                if(error.error.status = HttpStatusCode.Unauthorized){

                  await this.presentAlert("Ocurrio un error", error.error.message);

                  return EMPTY;
                }
                return EMPTY;
              })
            ).subscribe(response => {

              if(response.statusCode === HttpStatusCode.Ok){
                this.authService.logout().subscribe(() => {
                  this.modalChangePassword().dismiss("", 'confirm');
                  this.router.navigate(["/home"]);
                })
              }
            })
          },
        },
      ],
    });

    await alert.present();
  }

  async presentAlert(title: string, message: string) {
    const alert = await this.alertController.create({
      header: title,
      message,
      buttons: ['Aceptar'],
    });

    await alert.present();
  }

  public navigateTo(page: string) {
    alert(`Navegando a ${page} (en construcción)`);
  }

  public cancelProfile() {
    this.modalChangeProfile().dismiss(null, 'cancel');
  }

  public cancelPassword() {
    this.modalChangePassword().dismiss(null, 'cancel');
  }

  public onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.message = `Hello, ${ev.detail.data}!`;
    }
  }
}
