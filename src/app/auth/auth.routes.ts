import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthComponent } from './auth.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ForgotPasswordConfirmComponent } from './components/forgot-password-confirm/forgot-password-confirm.component';
import { ActivateComponent } from './components/activate/activate.component';

export const routesAuth: Routes = [

  {
    path: "",
    component: AuthComponent,
    children: [
      {
        path: "login",
        component: LoginComponent
      },
      {
        path: "register",
        component: RegisterComponent
      },
      {
        path: "forgot-password",
        component: ForgotPasswordComponent
      },
      {
        path: "forgot-password/confirm/:uuid/:token",
        component: ForgotPasswordConfirmComponent
      },
      {
        path: "activate/account/:uuid/:token",
        component: ActivateComponent
      }
    ]
  },
];
