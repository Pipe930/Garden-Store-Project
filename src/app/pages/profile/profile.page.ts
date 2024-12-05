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
import { Profile, profileJson } from 'src/app/core/interfaces/profile';
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
  IonTitle
} from '@ionic/angular/standalone';

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
  private readonly builder = inject(FormBuilder);

  public modal = viewChild.required<IonModal>(IonModal);
  public message = 'This modal example uses triggers to automatically open a modal when the button is clicked.';
  public name = "";

  public profile = signal<Profile>(profileJson);
  public updateProfile: FormGroup = this.builder.group({
    firstName: this.builder.control('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
    lastName: this.builder.control('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
    email: this.builder.control('', [Validators.required, Validators.email, Validators.maxLength(255)]),
    phone: this.builder.control('', [Validators.required, Validators.pattern(/^\+569\d{8}$/)])
  })

  user = {
    avatar: 'https://i.pravatar.cc/150?img=5',
    name: 'Juan Pérez',
    email: 'juan.perez@example.com',
    phone: '+56 9 1234 5678',
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

    this.authService.profile().subscribe(response => {
      this.profile.set(response.data);

      this.updateProfile.get('firstName')?.setValue(response.data.firstName);
      this.updateProfile.get('lastName')?.setValue(response.data.lastName);
      this.updateProfile.get('email')?.setValue(response.data.email);
      this.updateProfile.get('phone')?.setValue(response.data.phone);
    });
  }

  public editProfile() {

    this.authService.updateProfile(this.updateProfile.value).subscribe(() => {

      this.showToast('Perfil actualizado correctamente');
      this.modal().dismiss(this.name, 'confirm');
    });
  }

  public changePassword() {
    alert('Cambiar contraseña (en construcción)');
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

  public navigateTo(page: string) {
    alert(`Navegando a ${page} (en construcción)`);
  }

  public cancel() {
    this.modal().dismiss(null, 'cancel');
  }

  public onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.message = `Hello, ${ev.detail.data}!`;
    }
  }
}
