import { DebugElement } from '@angular/core';
import { RouterLink, RouterLinkWithHref } from '@angular/router';
import { TagsPageComponent } from '../tags-page.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIcon } from '@angular/material/icon';
import { By } from '@angular/platform-browser';
import { RouteProviders } from '@back-office/app/routers';
import {
  EndpointsProvider,
  ENDPOINTS_TOKEN,
  EndpointId,
} from '@back-office/endpoints-context';
import { TagApiService } from '@shared/public-api';

export class TagsPageBaseTestUtils {
  protected fixture!: ComponentFixture<TagsPageComponent>;
  protected testedComponent!: TagsPageComponent;

  protected addTagPageUrl!: string;
  protected editTagPageBaseUrl!: string;
  protected loadAllTagsSpy!: jasmine.Spy;

  constructor() {
    TestBed.configureTestingModule({
      imports: [TagsPageComponent, RouterLink, MatIcon],
      providers: [
        RouteProviders,
        EndpointsProvider,
        {
          provide: TagApiService,
          useValue: {},
        },
      ],
    });
  }

  protected onComponentsCompilation(): void {
    const endpoints = TestBed.inject(ENDPOINTS_TOKEN);
    this.addTagPageUrl = endpoints.getRelativePath(EndpointId.AddTag);
    this.editTagPageBaseUrl = endpoints.getRelativePath(EndpointId.EditTag);
  }

  protected onComponentCreation() {
    this.testedComponent = this.fixture.componentInstance;
    this.loadAllTagsSpy = spyOn(this.testedComponent as any, 'loadAllTags');
    this.fixture.detectChanges();
  }

  protected getAddTagAnchor(): DebugElement {
    return this.fixture.debugElement.query(By.css('.tags__add-tag'));
  }

  // https://stackoverflow.com/a/48196553/6281776
  protected expectAnchorToRedirectTo(
    anchor: DebugElement,
    expectedUrl: string
  ): void {
    const routerLinkInstance = anchor.injector.get(RouterLinkWithHref);
    expect(routerLinkInstance.href).toBe(`/${expectedUrl}`);
  }

  protected getTagsList(): DebugElement {
    return this.fixture.debugElement.query(By.css('.tags__list'));
  }

  protected getEditTagPageUrl(tagIndex: number): string {
    const tagId = this.testedComponent.tags()[tagIndex]._id;
    return this.editTagPageBaseUrl.replace(':id', tagId);
  }

  protected getTagText(tagIndex: number): string {
    const anchor = this.getTagAnchor(tagIndex);
    return anchor.childNodes[0].nativeNode.data;
  }

  protected getTagAnchor(tagIndex: number): DebugElement {
    const tagItem = this.getTagsListItem(tagIndex);
    return tagItem.children[0];
  }

  private getTagsListItem(index: number): DebugElement {
    const tagsList = this.getTagsList();
    return tagsList.children[index];
  }
}
