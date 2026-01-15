import Keycloak from "keycloak-js";
import { environment } from "../../../environments/environment";

let keycloakInstance: Keycloak | undefined;

export function initializeKeycloak(): Promise<boolean> {
    keycloakInstance = new Keycloak({
        url: environment.keycloak.url,
        realm: environment.keycloak.realm,
        clientId: environment.keycloak.clientId
    })

    return keycloakInstance.init({
        onLoad: 'check-sso',
        checkLoginIframe: false,
        pkceMethod: 'S256',
        flow: 'standard'
    })
}

export function getKeycloakInstance(): Keycloak {
    if (!keycloakInstance) {
        throw new Error("Keycloak not initialized");
    }
    return keycloakInstance;
}