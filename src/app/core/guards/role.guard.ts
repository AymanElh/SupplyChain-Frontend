import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { KeycloakService } from '../services/keycloak-service';
import { NotificationService } from '../services/notification.service';

/**
 * Role-based route guard. Declare required realm roles via route data:
 *   { path: '...', canActivate: [authGuard, roleGuard], data: { roles: ['...'], sectionName: '...' } }
 *
 * If a user lacks the required role, they are redirected to /access-denied
 * with clear feedback specifying what they tried to access.
 */
export const roleGuard: CanActivateFn = (route, state) => {
  const keycloakService = inject(KeycloakService);
  const notification = inject(NotificationService);
  const router = inject(Router);

  if (!keycloakService.isLoggedIn()) {
    keycloakService.login();
    return false;
  }

  // If user has no business roles at all
  if (!keycloakService.hasAnyBusinessRole()) {
    router.navigate(['/access-denied'], { queryParams: { reason: 'no_role' } });
    return false;
  }

  const requiredRoles = (route.data?.['roles'] ?? []) as string[];
  const sectionName = (route.data?.['sectionName'] ?? route.routeConfig?.path ?? '') as string;

  if (requiredRoles.length === 0) {
    return true;
  }

  if (keycloakService.hasAnyRole(requiredRoles)) {
    return true;
  }

  notification.warning(
    'Insufficient permissions',
    `You are unauthorized to access ${sectionName || 'this section'}.`
  );
  router.navigate(['/access-denied'], {
    queryParams: {
      section: sectionName,
      required: requiredRoles.join(',')
    }
  });
  return false;
};
