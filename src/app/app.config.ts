import { APP_INITIALIZER, ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { initializeKeycloak } from './core/utils/keycloak-init';
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([
        authInterceptor
      ])
    ),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloakFactory,
      multi: true
    }
  ]
};

export function initializeKeycloakFactory() {
  return (): Promise<boolean> => {
    return initializeKeycloak()
      .then((authenticated) => {
        console.log('Keycloak initialized. Authenticated:', authenticated);
        return authenticated;
      })
      .catch((error) => {
        console.error('Keycloak initialization failed', error);
        return false;
      });
  };
}
