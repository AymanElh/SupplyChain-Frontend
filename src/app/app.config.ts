import { APP_INITIALIZER, ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { initializeKeycloak } from './core/utils/keycloak-init';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { customerReducer } from './features/customers/state/customer.reducer';
import { ClientEffects } from './features/customers/state/customer.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([
        authInterceptor
    ])),
    {
        provide: APP_INITIALIZER,
        useFactory: initializeKeycloakFactory,
        multi: true
    },
    provideStore({
      customers: customerReducer
    }),
    provideEffects([ClientEffects])
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
