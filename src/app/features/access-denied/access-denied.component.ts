import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { KeycloakService } from '../../core/services/keycloak-service';

@Component({
  selector: 'app-access-denied',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './access-denied.component.html',
  styleUrls: ['./access-denied.component.css']
})
export class AccessDeniedComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  public keycloakService = inject(KeycloakService);

  sectionName: string = '';
  requiredRoles: string[] = [];
  userRoles: string[] = [];
  isNoRole: boolean = false;
  hasAnyBusinessRole: boolean = false;

  ngOnInit(): void {
    this.userRoles = this.keycloakService.getUserRoles();
    this.hasAnyBusinessRole = this.keycloakService.hasAnyBusinessRole();

    this.route.queryParams.subscribe(params => {
      this.sectionName = params['section'] || '';
      const req = params['required'];
      this.requiredRoles = req ? req.split(',') : [];
      this.isNoRole = params['reason'] === 'no_role' || !this.hasAnyBusinessRole;
    });
  }

  logout(): void {
    this.keycloakService.logout();
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
