import { ApplicationConfig, provideZoneChangeDetection, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import localeEs from '@angular/common/locales/es';

import { routes } from './app.routes';
import { apiAuthorizationInterceptor } from './core/interceptors/api-authorization.interceptor';
import { apiExceptionInterceptor } from './core/interceptors/api-exception.interceptor';

registerLocaleData(localeEs, 'es');

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([apiAuthorizationInterceptor, apiExceptionInterceptor])
    ),
    provideAnimationsAsync(),
    { provide: LOCALE_ID, useValue: 'es' }
  ]
};
