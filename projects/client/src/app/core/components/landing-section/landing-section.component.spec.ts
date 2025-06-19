import { ITag } from '@shared/tag-context';
import { LandingSectionComponentTestUtils } from './landing-section.component.test-utils';
import { IGallery } from '@shared/photo-context';

describe('LandingSectionComponent', () => {
  let testUtils: LandingSectionComponentTestUtils;
  let galleries: IGallery[] | undefined;

  beforeEach(async () => {
    testUtils = new LandingSectionComponentTestUtils();
    await testUtils.globalBeforeEach();
  });

  it('should create', () => {
    const testedComponent = testUtils.getTestedComponent();
    expect(testedComponent).toBeTruthy();
  });

  describe('when there is no loaded gallery', () => {
    beforeEach(async () => {
      galleries = undefined;
      await testUtils.simulateGalleriesFromServer(galleries);
    });

    it('should display the no-galleries place holder', () => {
      const noGalleryPlaceHolder = testUtils.getNoGalleryPlaceHolder();
      expect(noGalleryPlaceHolder).toBeTruthy();
    });

    it('should not display the galleries', () => {
      const galleries = testUtils.getGalleryPreview();
      expect(galleries.length).toBe(0);
    });
  });

  describe('when there are loaded galleries', () => {
    const tags: ITag[] = [{ _id: 'tag-1' }, { _id: 'tag-2' }, { _id: 'tag-3' }];
    let galleries: IGallery[];

    beforeEach(async () => {
      galleries = tags.map((t) => testUtils.createGallery(t._id));
      await testUtils.simulateGalleriesFromServer(galleries);
    });

    it('should not display the no-gallery place holder', () => {
      const noGalleryPlaceHolder = testUtils.getNoGalleryPlaceHolder();
      expect(noGalleryPlaceHolder).toBeFalsy();
    });

    it('should display a gallery preview for each gallery', () => {
      const galleryPreviews = testUtils.getGalleryPreview();
      const expectedSwipersNb = galleries.length;
      expect(galleryPreviews.length).toBe(expectedSwipersNb);
    });
  });
});
