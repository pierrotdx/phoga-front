import { IEndpoints, Endpoint } from '.';
import { EndpointId } from './models/endpoint-id';

export class Endpoints implements IEndpoints {
  private readonly endpoints: Record<EndpointId, Endpoint>;

  private readonly loginPageEndpoint = new Endpoint('');

  private readonly restrictedEndpoint = new Endpoint('restricted');

  private readonly adminPhotoEndpoint = new Endpoint(
    'photo',
    this.restrictedEndpoint
  );

  private readonly addPhotoEndpoint = new Endpoint(
    'add',
    this.adminPhotoEndpoint
  );
  private readonly editPhotoEndpoint = new Endpoint(
    'edit/:id',
    this.adminPhotoEndpoint
  );

  constructor() {
    this.endpoints = {
      [EndpointId.LoginPage]: this.loginPageEndpoint,
      [EndpointId.Restricted]: this.restrictedEndpoint,
      [EndpointId.AdminPhoto]: this.adminPhotoEndpoint,
      [EndpointId.AddPhoto]: this.addPhotoEndpoint,
      [EndpointId.EditPhoto]: this.editPhotoEndpoint,
    };
  }

  getRelativePath(id: EndpointId): string {
    return this.endpoints[id].getRelativePath();
  }

  getFullPath(id: EndpointId): string {
    return this.endpoints[id].getFullPath();
  }
}
