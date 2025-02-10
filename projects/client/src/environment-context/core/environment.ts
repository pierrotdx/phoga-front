import { IEnvironment } from './models/environment';

export const environment: IEnvironment = {
  phogaApiUrl: 'http://localhost:3000',
  mainContact: {
    name: "First Contact",
    description: "photography, website",
    email: 'contact@nomail.com',
    github: 'contactGithub',
    instagram: 'contactInstagram',
  },
  designContact: {
    name: 'Second Contact',
    description: 'design',
    email: 'designerName@nomail.com',
    behance: 'designerBehance',
  },
};
