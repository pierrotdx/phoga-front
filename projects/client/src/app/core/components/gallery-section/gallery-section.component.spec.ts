import { ISearchPhotoFilter, ITag } from '@shared/public-api';
import { GallerySectionComponent } from './gallery-section.component';
import { GallerySectionTestUtils } from './gallery-section.test-utils';

describe('GalleryComponent', () => {
  let testUtils: GallerySectionTestUtils;
  let testedComponent: GallerySectionComponent;

  beforeEach(async () => {
    testUtils = new GallerySectionTestUtils();
    await testUtils.globalBeforeEach();
    testedComponent = testUtils.getTestedComponent();
  });

  it('should create', () => {
    testUtils.expectTestedComponentToBeCreated();
  });

  describe('when no tag is selected', () => {
    it('should load photos with no filter', () => {
      const expectedFilter = undefined;
      testUtils.expectPhotosLoaderToHaveBeenCalledWithFilter(expectedFilter);
    });
  });

  describe('when a tag is selected from the gallery navigation', () => {
    const selectedTagId: ITag['_id'] = 'dumb-tag-id';

    beforeEach(() => {
      testedComponent.selectedTag.set(selectedTagId);
      testUtils.detectChanges();
    });

    it('should load the photos corresponding to the required tag', () => {
      const expectedFilter: ISearchPhotoFilter = { tagId: selectedTagId };
      testUtils.expectPhotosLoaderToHaveBeenCalledWithFilter(expectedFilter);
    });
  });

  it('should display the gallery-navigation component', () => {
    testUtils.expectGalleryNavigationToBeDisplayed();
  });
});
