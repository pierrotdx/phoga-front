import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditPhotoFormComponent } from './edit-photo-form.component';
import { UuidProvider } from '@shared/uuid-context/adapters/primary/uuid-provider';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { IPhoto } from '@shared/photo-context';

export class EditPhotoFormTestUtils {
  component!: EditPhotoFormComponent;
  fixture!: ComponentFixture<EditPhotoFormComponent>;

  async globalBeforeEach(): Promise<void> {
    await TestBed.configureTestingModule({
      imports: [EditPhotoFormComponent],
      providers: [UuidProvider],
    }).compileComponents();

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
