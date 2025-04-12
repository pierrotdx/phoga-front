import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  EndpointId,
  ENDPOINTS_TOKEN,
  EndpointsProvider,
  IEndpoint,
  IEndpoints,
} from '@back-office/endpoints-context';
import { ITag, TagApiService } from '@shared/public-api';
import { UUID_PROVIDER_TOKEN } from '@shared/uuid-context';
import { EditTagComponent } from './edit-tag.component';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { ITagVM } from '@back-office/app/models';
import { BehaviorSubject } from 'rxjs';
import { UuidProvider } from '@shared/uuid-context/adapters/primary/uuid-provider';
import { provideRouter, Router } from '@angular/router';

export class EditTagTestUtils {
  private testedComponent!: EditTagComponent;
  private fixture!: ComponentFixture<EditTagComponent>;

  private readonly dumbVoidObservable = new BehaviorSubject<void>(
    undefined
  ).asObservable();
  private fakeTagApiService = jasmine.createSpyObj<TagApiService>(
    'TagApiService',
    {
      add: this.dumbVoidObservable,
      delete: this.dumbVoidObservable,
      replace: this.dumbVoidObservable,
    }
  );

  private uuidGeneratorSpy!: jasmine.Spy;
  private readonly generatedTagId = 'generated-tag-id';

  private navigateSpy!: jasmine.Spy;

  constructor() {
    TestBed.configureTestingModule({
      imports: [EditTagComponent],
      providers: [
        provideRouter([]),
        EndpointsProvider,
        UuidProvider,
        {
          provide: TagApiService,
          useValue: this.fakeTagApiService,
        },
      ],
    });
  }

  async globalBeforeEach(): Promise<void> {
    await TestBed.compileComponents();
    this.fixture = TestBed.createComponent(EditTagComponent);
    this.onComponentCreation();
    this.fixture.autoDetectChanges();
  }

  private onComponentCreation(): void {
    this.testedComponent = this.fixture.componentInstance;
    this.mockFetchTag();
    this.mockUuidGenerator();
    this.setNavigateSpy();
  }

  private mockFetchTag(): void {
    spyOn(this.testedComponent as any, 'fetchTag').and.callFake(
      this.fetchTagFake
    );
  }

  private fetchTagFake = (_id: string): ITag => ({ _id });

  private mockUuidGenerator() {
    const uuidGenerator = TestBed.inject(UUID_PROVIDER_TOKEN);
    this.uuidGeneratorSpy = spyOn(uuidGenerator, 'generate');
    this.uuidGeneratorSpy.and.returnValue(this.generatedTagId);
  }

  private setNavigateSpy(): void {
    const router = TestBed.inject(Router);
    this.navigateSpy = spyOn(router, 'navigate');
  }

  expectComponentToBeCreated(): void {
    expect(this.testedComponent).toBeTruthy();
  }

  expectTagFormToBeDisplayed(): void {
    const tagForm = this.fixture.debugElement.query(
      By.css('app-edit-tag-form')
    );
    expect(tagForm).toBeTruthy();
  }

  setIdInput(id: string): void {
    this.fixture.componentRef.setInput('id', id);
  }

  async whenStable(): Promise<void> {
    await this.fixture.whenStable();
  }

  expectDeleteButtonToBe(expectedDisplay: 'displayed' | 'not displayed'): void {
    const deleteButton = !!this.getDeleteButton();
    expect(deleteButton).toBe(expectedDisplay === 'displayed');
  }

  private getDeleteButton(): DebugElement {
    return this.fixture.debugElement.query(By.css('.edit-tag__delete'));
  }

  clickOnDeleteButton(): void {
    const deleteButton = this.getDeleteButton();
    deleteButton.nativeElement.click();
  }

  expectDeleteTagRequestToBeSentWithId(expectedId: string): void {
    const deleteSpy = this.fakeTagApiService.delete;
    expect(deleteSpy).toHaveBeenCalledWith(expectedId);
  }

  async onSave(tagVM: ITagVM): Promise<void> {
    await this.testedComponent['onSave'](tagVM);
  }

  expectUpdateTagRequestToBeSentWith(expectedTag: ITag): void {
    const updateTagSpy = this.fakeTagApiService.replace;
    expect(updateTagSpy).toHaveBeenCalledOnceWith(expectedTag);
  }

  expectAddTagRequestToBeSentWith(expectedTagVM: ITagVM): void {
    const addTagSpy = this.fakeTagApiService.add;
    const newTag = {
      _id: this.generatedTagId,
      name: expectedTagVM.name,
    };
    expect(addTagSpy).toHaveBeenCalledOnceWith(newTag);
  }

  expectNavigationTo(endpointId: EndpointId): void {
    const endpoints = TestBed.inject(ENDPOINTS_TOKEN);
    const expectedPath = endpoints.getFullPath(endpointId);
    expect(this.navigateSpy).toHaveBeenCalledOnceWith([expectedPath]);
  }

  async onCancel(): Promise<void> {
    await this.testedComponent.onCancel();
  }
}
