import { Photo } from '@shared/photo-context';
import { GalleryPaginationComponentTestUtils } from './gallery-pagination.component.test-utils';

describe('GalleryPaginationComponent', () => {
  let testUtils: GalleryPaginationComponentTestUtils;

  beforeEach(async () => {
    testUtils = new GalleryPaginationComponentTestUtils();
    await testUtils.globalBeforeEach();
  });

  it('should create', () => {
    const testedComponent = testUtils.getTestedComponent();
    expect(testedComponent).toBeTruthy();
  });

  describe("when the gallery's total count is not defined", () => {
    it('should not display anything', () => {
      const testedComponentElt = testUtils.getTestedComponentElement();
      expect(testedComponentElt.children.length).toBe(0);
    });
  });

  describe("when the gallery's total count is defined", () => {
    const dumbTotalCount = 4;

    beforeEach(() => {
      testUtils.simulateTotalCount(dumbTotalCount);
      testUtils.detectChanges();
    });

    describe('when there is no selected photo', () => {
      it('should not display anything', () => {
        const testedComponentElt = testUtils.getTestedComponentElement();
        expect(testedComponentElt.children.length).toBe(0);
      });
    });

    describe('when there is a selected photo', () => {
      const selectedPhoto = new Photo('dumb-photo-1');

      beforeEach(() => {
        testUtils.simulateSelectedPhoto(selectedPhoto);
        testUtils.detectChanges();
      });

      it('should display the total count', () => {
        const totalCountElt = testUtils.getTotalCountElt()
          .nativeElement as HTMLSpanElement;

        expect(totalCountElt).toBeTruthy();
        const expectedTotalCount = dumbTotalCount;
        expect(totalCountElt.textContent).toBe(expectedTotalCount.toString());
      });

      it('should display the position of the selected photo in the gallery', () => {
        const dumbPhotos = [
          new Photo('dumb-photo-2'),
          selectedPhoto,
          new Photo('dumb-photo-3'),
        ];
        const expectedPosition = dumbPhotos.indexOf(selectedPhoto) + 1;

        testUtils.simulateGalleryPhotos({
          all: dumbPhotos,
          lastBatch: dumbPhotos,
        });
        testUtils.detectChanges();

        const selectedPhotoPositionElt = testUtils.getSelectedPhotoPositionElt()
          .nativeElement as HTMLSpanElement;
        expect(selectedPhotoPositionElt.textContent).toBe(
          expectedPosition.toString()
        );
      });
    });
  });
});
