import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then( m => m.HomePage)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then( m => m.RegisterPage)
  },
  {
    path: 'list-products',
    loadComponent: () => import('./pages/list-products/list-products.page').then( m => m.ListProductsPage)
  },
  {
    path: 'detail-product/:slug',
    loadComponent: () => import('./pages/detail-product/detail-product.page').then( m => m.DetailProductPage)
  },
  {
    path: 'cart',
    loadComponent: () => import('./pages/cart/cart.page').then( m => m.CartPage),
    canActivate: [authGuard]
  },
  {
    path: 'list-purchases-user',
    loadComponent: () => import('./pages/list-purchases-user/list-purchases-user.page').then( m => m.ListPurchasesUserPage),
    canActivate: [authGuard]
  },
  {
    path: 'generate-qr',
    loadComponent: () => import('./pages/generate-qr/generate-qr.page').then( m => m.GenerateQrPage),
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile.page').then( m => m.ProfilePage),
    canActivate: [authGuard]
  },
];
