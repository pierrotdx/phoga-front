import { IEnvironment } from './models/environment';

export const environment: IEnvironment = {
  phogaApiUrl: 'https://phoga-api-prod-99420973827.europe-west9.run.app',
  auth0Config: {
    domain: 'phoga.eu.auth0.com',
    clientId: 'vTO8JK2YG9f1lxDoxvm5cqAk0NeknmHk',
    authorizationParams: {
      redirect_uri: window.location.origin,
      audience: 'phoga-public-api',
    },
  },
};
