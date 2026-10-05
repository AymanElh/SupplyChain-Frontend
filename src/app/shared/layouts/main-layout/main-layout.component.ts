import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { KeycloakService } from '../../../core/services/keycloak-service';
import { UserProfile } from '../../../core/models/user-profile';
import { ThemeService } from '../../../core/services/theme.service';

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
    private keycloakService: KeycloakService,
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

  navigationItems = [
    { 
      label: 'Dashboard', 
      path: '/dashboard',
      iconType: 'dashboard'
    },
    { 
      label: 'Suppliers', 
      path: '/supply/suppliers',
      iconType: 'suppliers'
    },
    { 
      label: 'Materials', 
      path: '/supply/materials',
      iconType: 'materials'
    },
    { 
      label: 'Purchase Orders', 
      path: '/supply/orders',
      iconType: 'orders'
    },
    {
      label: 'Production & Products',
      path: '/production/products',
      iconType: 'products'
    },
    {
      label: 'Production Orders',
      path: '/production/orders',
      iconType: 'orders'
    }
  ];

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
