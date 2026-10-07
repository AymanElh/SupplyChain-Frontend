export const environment = {
  production: true,
  apiUrl: "/api/v1",
  apiTimeout: 30000,

  keycloak: {
    url: "/auth",
    realm: "supplychain",
    clientId: "supplychain-frontend"
  }
};
