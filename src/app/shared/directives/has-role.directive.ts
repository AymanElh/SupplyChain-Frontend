import { Directive, Input, TemplateRef, ViewContainerRef, inject } from '@angular/core';
import { KeycloakService } from '../../core/services/keycloak-service';

/**
 * Structural directive that renders its content only when the logged-in user
 * holds at least one of the given Keycloak realm roles.
 *
 * Usage:
 *   <button *appHasRole="['ADMIN', 'CHEF_PRODUCTION']">…</button>
 *   <button *appHasRole="'ADMIN'">…</button>
 */
@Directive({
  selector: '[appHasRole]',
  standalone: true
})
export class HasRoleDirective {
  private templateRef = inject(TemplateRef<unknown>);
  private viewContainer = inject(ViewContainerRef);
  private keycloakService = inject(KeycloakService);
  private hasView = false;

  @Input() set appHasRole(roles: string | string[]) {
    const required = Array.isArray(roles) ? roles : [roles];
    const allowed = this.keycloakService.hasAnyRole(required);

    if (allowed && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!allowed && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}
