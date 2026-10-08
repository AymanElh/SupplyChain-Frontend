import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { KeycloakService } from "../services/keycloak-service";

export const authGuard: CanActivateFn = (route, state) => {
  const keycloakService = inject(KeycloakService);
  const router = inject(Router);

  if (!keycloakService.isLoggedIn()) {
    keycloakService.login();
    return false;
  }

  // If user has no business roles and is not already heading to access-denied
  if (!keycloakService.hasAnyBusinessRole() && !state.url.includes('/access-denied')) {
    router.navigate(['/access-denied'], { queryParams: { reason: 'no_role' } });
    return false;
  }

  return true;
};
