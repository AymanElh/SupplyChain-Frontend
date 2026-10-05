import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { KeycloakService } from '../services/keycloak-service';
import { NotificationService } from '../services/notification.service';

/**
 * Role-based route guard. Declare required realm roles via route data:
 *   { path: 'admin', canActivate: [authGuard, roleGuard], data: { roles: ['ADMIN'] } }
 *
 * The backend remains the source of truth for authorization; this guard only
 * keeps users from navigating to screens whose actions would all return 403.
 */
export const roleGuard: CanActivateFn = (route) => {
  const keycloakService = inject(KeycloakService);
  const notification = inject(NotificationService);
  const router = inject(Router);

  const requiredRoles = (route.data?.['roles'] ?? []) as string[];

  if (requiredRoles.length === 0) {
    return true;
  }

  if (!keycloakService.isLoggedIn()) {
    keycloakService.login();
    return false;
  }

  if (keycloakService.hasAnyRole(requiredRoles)) {
    return true;
  }

  notification.warning(
    'Insufficient permissions',
    'Your account does not have access to this section.'
  );
  router.navigate(['/dashboard']);
  return false;
};
