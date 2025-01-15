import { IEnvironment } from './models/environment';

export const environment: IEnvironment = {
  phogaApiUrl: 'https://phoga-api-84144217271.europe-west9.run.app',
  auth0Config: {
    domain: 'phoga-dev.eu.auth0.com',
    clientId: 'xpTRZLYBplUlMaHxSYIvtoW0MO0pUh2H',
    authorizationParams: {
      redirect_uri: window.location.origin,
      audience: 'phoga-dev-public-api',
    },
  },
};
