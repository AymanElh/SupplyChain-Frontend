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
      console.log("Profile: ", this._profile);
    } catch (error) {
      console.error("Failed to load user profile", error);
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
    console.log("Token: ", this.keycloak.token);
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

  isLoggedIn(): boolean {
    return this.keycloak.authenticated || false;
  }
}
