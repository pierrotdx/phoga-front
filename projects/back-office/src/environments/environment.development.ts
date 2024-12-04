export const environment = {
  auth0Config: {
    domain: 'phoga-dev.eu.auth0.com',
    clientId: 'xpTRZLYBplUlMaHxSYIvtoW0MO0pUh2H',
    authorizationParams: {
      redirect_uri: window.location.origin,
      audience: 'phoga-dev-public-api',
    },
  },
};
