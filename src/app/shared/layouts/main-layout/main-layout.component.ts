import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { KeycloakService } from '../../../core/services/keycloak-service';
import { UserProfile } from '../../../core/models/user-profile';
import { ThemeService } from '../../../core/services/theme.service';
import { UserRole, ALL_BUSINESS_ROLES } from '../../../core/models/user-roles';

export interface NavItem {
  label: string;
  path: string;
  iconType: string;
  roles?: string[];
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent implements OnInit {
  isSidebarOpen = signal(true);
  userProfile = signal<UserProfile | null>({
    username: 'guest',
    email: 'guest@supply.com',
    firstName: 'Guest',
    lastName: 'User',
    fullName: 'Guet user'
  });

  constructor(
    public keycloakService: KeycloakService,
    private router: Router,
    public themeService: ThemeService
  ) { }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  toggleSidebar(): void {
    this.isSidebarOpen.update(value => !value);
  }

  todayDate = signal<string>(new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }));

  navigationSections: NavSection[] = [
    {
      label: 'Overview',
      items: [
        {
          label: 'Dashboard',
          path: '/dashboard',
          iconType: 'dashboard',
          roles: ALL_BUSINESS_ROLES
        }
      ]
    },
    {
      label: 'Supply',
      items: [
        {
          label: 'Suppliers',
          path: '/supply/suppliers',
          iconType: 'suppliers',
          roles: [UserRole.RESPONSABLE_ACHATS, UserRole.GESTIONNAIRE_APPROVISIONNEMENT]
        },
        {
          label: 'Materials',
          path: '/supply/materials',
          iconType: 'materials',
          roles: [UserRole.GESTIONNAIRE_APPROVISIONNEMENT]
        },
        {
          label: 'Purchase Orders',
          path: '/supply/orders',
          iconType: 'orders',
          roles: [UserRole.RESPONSABLE_ACHATS, UserRole.SUPERVISEUR_LOGISTIQUE]
        }
      ]
    },
    {
      label: 'Production',
      items: [
        {
          label: 'Production & Products',
          path: '/production/products',
          iconType: 'products',
          roles: [UserRole.CHEF_PRODUCTION, UserRole.SUPERVISEUR_PRODUCTION]
        },
        {
          label: 'Production Orders',
          path: '/production/orders',
          iconType: 'orders',
          roles: [UserRole.CHEF_PRODUCTION, UserRole.SUPERVISEUR_PRODUCTION, UserRole.PLANIFICATEUR]
        }
      ]
    },
    {
      label: 'Delivery',
      items: [
        {
          label: 'Customers',
          path: '/delivery/customers',
          iconType: 'suppliers',
          roles: [UserRole.GESTIONNAIRE_COMMERCIAL]
        },
        {
          label: 'Customer Orders',
          path: '/delivery/customer-orders',
          iconType: 'orders',
          roles: [UserRole.GESTIONNAIRE_COMMERCIAL, UserRole.SUPERVISEUR_LIVRAISONS]
        },
        {
          label: 'Deliveries',
          path: '/delivery/deliveries',
          iconType: 'materials',
          roles: [UserRole.SUPERVISEUR_LIVRAISONS]
        },
        {
          label: 'Drivers',
          path: '/delivery/drivers',
          iconType: 'dashboard',
          roles: [UserRole.SUPERVISEUR_LIVRAISONS]
        },
        {
          label: 'Vehicles',
          path: '/delivery/vehicles',
          iconType: 'materials',
          roles: [UserRole.SUPERVISEUR_LIVRAISONS]
        }
      ]
    },
    {
      label: 'Administration',
      items: [
        {
          label: 'Users',
          path: '/admin/users',
          iconType: 'suppliers',
          roles: [UserRole.ADMIN]
        },
        {
          label: 'Roles',
          path: '/admin/roles',
          iconType: 'dashboard',
          roles: [UserRole.ADMIN]
        }
      ]
    }
  ];

  get visibleNavigationSections(): NavSection[] {
    return this.navigationSections
      .map(section => ({
        ...section,
        items: section.items.filter(item => {
          if (!item.roles || item.roles.length === 0) return true;
          return this.keycloakService.hasAnyRole(item.roles);
        })
      }))
      .filter(section => section.items.length > 0);
  }

  /** Flat list kept for backwards-compatible lookups */
  navigationItems = this.navigationSections.flatMap(section => section.items);

  private async loadUserProfile(): Promise<void> {
    try {
      const profile = await this.keycloakService.getUserProfile();
      if (profile) {
        console.log('✅ User profile loaded successfully:', profile);
        this.userProfile.set(profile as UserProfile);
      }
    } catch (error) {
      console.error('❌ Failed to load user profile:', error);
      // Keep default guest profile on error
    }
  }

  getUserInitials(): string {
    const profile = this.userProfile();
    const firstInitial = profile?.firstName?.charAt(0) || '';
    const secondInitial = profile?.lastName?.charAt(0) || '';
    return (firstInitial + secondInitial).toUpperCase() || 'GU';
  }

  logout(): void {
    const confirmLogout = confirm("Are you sure to logout?");
    if (confirmLogout) {
      this.keycloakService.logout();
    }
  }
}
