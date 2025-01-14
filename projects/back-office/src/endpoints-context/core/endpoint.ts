import { IEndpoint } from './models/endpoint';

export class Endpoint implements IEndpoint {
  constructor(
    private readonly relativePath: string,
    private readonly parent?: IEndpoint
  ) {}

  getRelativePath(): string {
    return this.relativePath;
  }

  getFullPath(): string {
    const parentRelativePath = this.parent?.getFullPath();
    return parentRelativePath
      ? `${parentRelativePath}/${this.relativePath}`
      : this.relativePath;
  }
}
