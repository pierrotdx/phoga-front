import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { IPhoto } from '@shared/photo-context';

import { EndpointsProvider } from '@back-office/endpoints-context';
import { PhotoItemComponent } from './photo-item.component';

export class PhotoItemTestUtils {
  component!: PhotoItemComponent;
  private fixture!: ComponentFixture<PhotoItemComponent>;

  async beforeEachGlobal(): Promise<void> {
    await TestBed.configureTestingModule({
      imports: [PhotoItemComponent, RouterModule.forRoot([])],
      providers: [EndpointsProvider],
    }).compileComponents();

    this.fixture = TestBed.createComponent(PhotoItemComponent);
    this.component = this.fixture.componentInstance;
    this.fixture.detectChanges();
  }

  setPhoto(photo: IPhoto | undefined): void {
    this.component.photo = photo;
    this.fixture.detectChanges();
  }

  expectElementToBeDisplayed(elementId: string): void {
    const element = this.getElementById(elementId);
    expect(element).toBeTruthy();
  }

  private getElementById(id: string): DebugElement {
    const pageElement = this.fixture.debugElement;
    return pageElement.query(By.css(`#${id}`));
  }
}
