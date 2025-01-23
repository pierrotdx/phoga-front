import { IEnvironment } from './models/environment';

export const environment: IEnvironment = {
  phogaApiUrl: 'https://phoga-staging-api-84144217271.europe-west9.run.app/',
  auth0Config: {
    domain: 'phoga-staging.eu.auth0.com',
    clientId: 'Ytn906GeMz2CTCfg2LC024iSoUbNPEXk',
    authorizationParams: {
      redirect_uri: window.location.origin,
      audience: 'phoga-staging-public-api',
    },
  },
};
