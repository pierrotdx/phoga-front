import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoMetadataComponent } from './photo-metadata.component';
import { PhotoUtilsServiceProvider } from '@shared/photo-context';

describe('PhotoMetadataComponent', () => {
  let component: PhotoMetadataComponent;
  let fixture: ComponentFixture<PhotoMetadataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoMetadataComponent],
      providers: [PhotoUtilsServiceProvider],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoMetadataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
