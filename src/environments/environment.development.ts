export const environment = {
  production: false,
  apiUrl: "http://localhost:8080/api/v1",
  apiTimeout: 30000,

  keycloak: {
    url: "http://localhost:8081",
    realm: "supplychain",
    clientId: "supplychain-front"
  }
};
