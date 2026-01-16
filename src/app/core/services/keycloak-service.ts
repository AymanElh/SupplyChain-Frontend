import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import Keycloak from "keycloak-js";
import { getKeycloakInstance } from '../utils/keycloak-init';
import { UserProfile } from '../models/user-profile';

@Injectable({
  providedIn: 'root',
})
export class KeycloakService {
  private keycloak: Keycloak;
  private _profile: UserProfile | undefined;
  private isAuthenticationSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticationSubject.asObservable();

  constructor() {
    this.keycloak = getKeycloakInstance();
    this.isAuthenticationSubject.next(this.keycloak.authenticated || false);
  }

  async getUserProfile() {
    try {
      this._profile = await this.keycloak.loadUserProfile();
      console.log("User profile from Keycloak server: ", this._profile);
      
      // Create fullName by combining firstName and lastName
      if (this._profile) {
        const firstName = this._profile.firstName || '';
        const lastName = this._profile.lastName || '';
        (this._profile as any).fullName = `${firstName} ${lastName}`.trim();
      }
      
      return this._profile;
    } catch (error) {
      console.error("Failed to load user profile", error);
      return undefined;
    }
  }

  async updateToken(minValidity: number = 30): Promise<boolean> {
    try {
      const refreshed = await this.keycloak.updateToken(minValidity);
      if (refreshed) {
        console.log("Token refreshed");
      }
      return refreshed;
    } catch (error) {
      console.error("Failed to refresh token: ", error);
      return false;
    }
  }

  getUserRoles(): string[] {
    const roles = this.keycloak.tokenParsed?.realm_access?.roles || [];
    return roles;
  }

  getToken(): string | undefined {
    return this.keycloak.token;
  }

  hasRole(role: string): boolean {
    return this.getUserRoles().includes(role);
  }

  hasAnyRole(roles: string[]): boolean {
    return roles.some(role => this.hasRole(role));
  }

  // update token

  login(): void {
    this.keycloak.login({
      redirectUri: window.location.origin
    })
  }

  logout() {
    this.keycloak.logout({
      redirectUri: window.location.origin
    });
  }

  isLoggedIn(): boolean {
    return this.keycloak.authenticated || false;
  }
}
