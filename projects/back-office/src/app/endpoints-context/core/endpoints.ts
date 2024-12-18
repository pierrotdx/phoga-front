import { IEndpoints, Endpoint } from '.';
import { EndpointId } from './models/endpoint-id';

export class Endpoints implements IEndpoints {
  private readonly endpoints: Record<EndpointId, Endpoint> = {
    [EndpointId.LoginPage]: new Endpoint(''),
    [EndpointId.Restricted]: new Endpoint('restricted'),
    [EndpointId.EditPage]: new Endpoint(':id'),
  };

  getRelativePath(id: EndpointId): string {
    return this.endpoints[id].getRelativePath();
  }
}
