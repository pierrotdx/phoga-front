import { IRoute } from './models/route';

export class Route implements IRoute {
  constructor(private readonly relativePath: string) {}

  getRelativePath(): string {
    return this.relativePath;
  }
}
