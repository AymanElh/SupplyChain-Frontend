/**
 * Keycloak realm roles enforced by the backend via @PreAuthorize.
 * Use these constants for roleGuard data and *appHasRole to avoid typos.
 */
export const UserRole = {
  ADMIN: 'ADMIN',
  CHEF_PRODUCTION: 'CHEF_PRODUCTION',
  SUPERVISEUR_PRODUCTION: 'SUPERVISEUR_PRODUCTION',
  PLANIFICATEUR: 'PLANIFICATEUR',
  GESTIONNAIRE_APPROVISIONNEMENT: 'GESTIONNAIRE_APPROVISIONNEMENT',
  RESPONSABLE_ACHATS: 'RESPONSABLE_ACHATS',
  SUPERVISEUR_LOGISTIQUE: 'SUPERVISEUR_LOGISTIQUE',
  GESTIONNAIRE_COMMERCIAL: 'GESTIONNAIRE_COMMERCIAL',
  SUPERVISEUR_LIVRAISONS: 'SUPERVISEUR_LIVRAISONS'
} as const;

export const ALL_BUSINESS_ROLES: string[] = Object.values(UserRole);

export type UserRole = (typeof UserRole)[keyof typeof UserRole];
