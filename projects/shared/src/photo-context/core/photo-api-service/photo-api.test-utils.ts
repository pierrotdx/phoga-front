import { TestBed } from '@angular/core/testing';
import { PhotoApiService } from './photo-api.service';
import { EnvironmentProviders, Provider } from '@angular/core';
import { HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';

export class PhotoApiTestUtils {
  readonly photoApiService: PhotoApiService;
  readonly httpTestingController: HttpTestingController;
  readonly httpClient: HttpClient;

  private readonly testBed: TestBed;

  constructor(
    providers: (Provider | EnvironmentProviders)[],
    imports: (Provider | EnvironmentProviders)[]
  ) {
    this.testBed = TestBed.configureTestingModule({
      imports,
      providers,
    });
    this.httpTestingController = this.testBed.inject(HttpTestingController);
    this.photoApiService = this.testBed.inject(PhotoApiService);
    this.httpClient = this.testBed.inject(HttpClient);
  }
}
