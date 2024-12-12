import { IEnvironment } from './models/environment';

export const environment: IEnvironment = {
  phogaApiUrl: 'phogaApiUrl',
  auth0Config: {
    domain: 'domain',
    clientId: 'clientId',
    authorizationParams: {
      redirect_uri: window.location.origin,
      audience: 'audience',
    },
  },
};
