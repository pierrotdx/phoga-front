import { IEndpoint } from './models/endpoint';

export class Endpoint implements IEndpoint {
  constructor(private readonly relativePath: string) {}

  getRelativePath(): string {
    return this.relativePath;
  }
}
