import { GalleryPreviewComponentTestUtils } from './gallery-preview.component.test-utils';
import { IGalleryPhotos, IPhoto, Photo } from '@shared/photo-context';
import { ComponentFixture } from '@angular/core/testing';
import { GalleryPreviewComponent } from './gallery-preview.component';

const dumbPhotos: IPhoto[] = [
  new Photo('photo-1'),
  new Photo('photo-2'),
  new Photo('photo-3'),
  new Photo('photo-4'),
];

describe('GalleryPreviewComponent', () => {
  let testUtils: GalleryPreviewComponentTestUtils;
  let fixture: ComponentFixture<GalleryPreviewComponent>;

  beforeEach(async () => {
    testUtils = new GalleryPreviewComponentTestUtils();
    await testUtils.globalBeforeEach();
    fixture = testUtils.getFixture();
  });

  it('should create', () => {
    const testedComponent = testUtils.getTestedComponent();
    expect(testedComponent).toBeTruthy();
  });

  describe('when there are photos to display', () => {
    const galleryPhotos: IGalleryPhotos = {
      all: dumbPhotos,
      lastBatch: dumbPhotos,
    };

    beforeEach(() => {
      testUtils.fakeGalleryPhotos(galleryPhotos);
    });

    it('should display a carousel with the gallery photos', () => {
      fixture.detectChanges();

      const carousel: HTMLElement = testUtils.getCarousel().nativeElement;
      expect(carousel).toBeTruthy();

      const carouselSlides = testUtils
        .getCarouselSlides()
        .map((s) => s.nativeElement);
      const expectedNbOfCarouselSlides = galleryPhotos.all.length;
      expect(carouselSlides.length).toBe(expectedNbOfCarouselSlides);
    });

    describe('when clicking on the gallery-preview link', () => {
      let selectSpy: jasmine.Spy;
      let navigateSpy: jasmine.Spy;

      beforeEach(() => {
        selectSpy = testUtils.getSelectSpy();
        selectSpy.calls.reset();

        navigateSpy = testUtils.getNavigateSpy();
        navigateSpy.calls.reset();
      });

      it('should navigate to the gallery', () => {
        fixture.detectChanges();
        const link = testUtils.getGalleryPreviewLink();

        link.nativeElement.click();
        fixture.detectChanges();

        const expectedSelectedGallery = testUtils.dumbGalleryId;
        expect(selectSpy).toHaveBeenCalledOnceWith(expectedSelectedGallery);

        const url = ['/'];
        const fragment = 'gallery';
        const expectedParams = [url, { fragment }];
        expect(navigateSpy).toHaveBeenCalledOnceWith(...expectedParams);
      });
    });
  });
});
