import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditPhotoFormComponent } from './edit-photo-form.component';
import { UuidProvider } from '@shared/uuid-context/adapters/primary/uuid-provider';
import { Component, DebugElement, input } from '@angular/core';
import { By } from '@angular/platform-browser';
import { IPhoto } from '@shared/photo-context';
import { EditPhotoTagsComponent } from '../edit-photo-tags/edit-photo-tags.component';
import { FormsModule } from '@angular/forms';
import { EditImageBufferComponent } from '../edit-image-buffer/edit-image-buffer.component';
import { EditMetadataComponent } from '../edit-metadata/edit-metadata.component';

@Component({
  selector: 'app-edit-photo-tags',
  template: '',
})
export class EditPhotoTagsStubComponent {
  viewModel = input<any>();
}

export class EditPhotoFormTestUtils {
  component!: EditPhotoFormComponent;
  fixture!: ComponentFixture<EditPhotoFormComponent>;

  async globalBeforeEach(): Promise<void> {
    await TestBed.configureTestingModule({
      imports: [EditPhotoFormComponent, EditPhotoTagsComponent],
      providers: [UuidProvider],
    })
      .overrideComponent(EditPhotoFormComponent, {
        set: {
          imports: [
            FormsModule,
            EditMetadataComponent,
            EditImageBufferComponent,
            EditPhotoTagsStubComponent,
          ],
        },
      })
      .compileComponents();

    this.fixture = TestBed.createComponent(EditPhotoFormComponent);
    this.component = this.fixture.componentInstance;
    this.fixture.detectChanges();
  }

  setPhoto(photo: IPhoto | undefined): void {
    if (photo) {
      this.component.photo = photo;
    }
    this.fixture.detectChanges();
  }

  setIsValid(value: boolean): void {
    this.component.isValid.set(value);
    this.fixture.detectChanges();
  }

  expectElementToBeDisplayed(id: string): void {
    const element = this.getElementById(id);
    expect(element).toBeTruthy();
  }

  getElementById(id: string): DebugElement {
    const pageElement = this.fixture.debugElement;
    return pageElement.query(By.css(`#${id}`));
  }
}
