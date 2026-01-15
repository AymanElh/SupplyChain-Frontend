import { inject } from "@angular/core";
import { CanActivateFn } from "@angular/router";
import { KeycloakService } from "../services/keycloak-service";


export const authGuard: CanActivateFn = (route, state) => {
  const keycloakService = inject(KeycloakService);

  if (keycloakService.isLoggedIn()) {
    return true;
  }

  // Redirect to Keycloak login
  keycloakService.login();
  return false;
};