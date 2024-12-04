export const environment = {
  auth0Config: {
    domain: 'domain',
    clientId: 'clientId',
    authorizationParams: {
      redirect_uri: window.location.origin,
      audience: 'audience',
    },
  },
};
