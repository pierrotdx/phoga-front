import { IGalleryPhotos, IPhoto, Photo } from '@shared/photo-context';
import {
  PhotoDetailedViewComponentTestUtils,
  PhotoImageStubComponent,
  PhotoMetadataStubComponent,
} from './photo-detailed-view.component.test-utils';
import { DebugElement } from '@angular/core';
import { Subscription } from 'rxjs';

describe('PhotoDetailedViewComponent', () => {
  let testUtils: PhotoDetailedViewComponentTestUtils;

  beforeEach(async () => {
    testUtils = new PhotoDetailedViewComponentTestUtils();
    await testUtils.globalBeforeEach();
  });

  it('should create', () => {
    testUtils.createComponent();

    const testedComponent = testUtils.getTestedComponent();
    expect(testedComponent).toBeTruthy();
  });

  describe('when no photo is selected from the gallery', () => {
    it('should only display a placeholder indicating no photo is available', () => {
      testUtils.createComponent();

      testUtils.expectOnlyNoPhotoPlaceHolderToBeDisplayed();
    });
  });

  describe('when a photo is selected from the gallery', () => {
    let fakePhotos: IPhoto[];
    let fakeGalleryPhotos: IGalleryPhotos;
    let selectedPhoto: IPhoto;

    beforeEach(() => {
      fakePhotos = [new Photo('test-photo-1'), new Photo('test-photo-2')];
      fakeGalleryPhotos = {
        all: fakePhotos,
        lastBatch: fakePhotos,
      };
      testUtils.simulateGalleryPhotos(fakeGalleryPhotos);

      selectedPhoto = fakePhotos[1];
      testUtils.selectPhoto(selectedPhoto);

      testUtils.createComponent();
    });

    it('should display the photo-image component with the selected photo', () => {
      const photoImageComp = testUtils.getEltBySelector('app-photo-image');
      expect(photoImageComp.nativeElement).toBeTruthy();

      const compInstance: PhotoImageStubComponent =
        photoImageComp.componentInstance;
      expect(compInstance.photo()).toEqual(selectedPhoto);
    });

    describe('the "select next" button', () => {
      let selectNextBtn: DebugElement;

      beforeEach(() => {
        selectNextBtn = testUtils.getEltBySelector(
          '.photo-detailed-view__next-btn'
        );
      });

      it('should be displayed', () => {
        expect(selectNextBtn).toBeTruthy();
      });

      describe('when clicked on', () => {
        let sub: Subscription;
        let hasEmitted = false;
        const onSelectNextEvent = () => {
          hasEmitted = true;
        };

        beforeEach(() => {
          const testedComponent = testUtils.getTestedComponent();
          sub = testedComponent.selectNext$.subscribe(onSelectNextEvent);
        });

        afterEach(() => {
          sub.unsubscribe();
        });

        it('should emit a selectNext$ event', () => {
          const btn = selectNextBtn.nativeElement as HTMLElement;
          btn.click();
          expect(hasEmitted).toBeTrue();
        });
      });
    });

    describe('the "select previous" button', () => {
      let selectPreviousBtn: DebugElement;

      beforeEach(() => {
        selectPreviousBtn = testUtils.getEltBySelector(
          '.photo-detailed-view__previous-btn'
        );
      });

      it('should be displayed', () => {
        expect(selectPreviousBtn).toBeTruthy();
      });

      describe('when clicked on', () => {
        let sub: Subscription;
        let hasEmitted = false;
        const onSelectPreviousEvent = () => {
          hasEmitted = true;
        };

        beforeEach(() => {
          const testedComponent = testUtils.getTestedComponent();
          sub = testedComponent.selectPrevious$.subscribe(
            onSelectPreviousEvent
          );
        });

        afterEach(() => {
          sub.unsubscribe();
        });

        it('should emit a selectPrevious$ event', () => {
          const btn = selectPreviousBtn.nativeElement as HTMLElement;
          btn.click();
          expect(hasEmitted).toBeTrue();
        });
      });
    });

    describe('the "close" button', () => {
      let closeBtn: DebugElement;

      beforeEach(() => {
        closeBtn = testUtils.getEltBySelector(
          '.photo-detailed-view__close-btn'
        );
      });

      it('should be displayed', () => {
        expect(closeBtn).toBeTruthy();
      });

      describe('when clicked on', () => {
        let sub: Subscription;
        let hasEmitted = false;
        const onCloseEvent = () => {
          hasEmitted = true;
        };

        beforeEach(() => {
          const testedComponent = testUtils.getTestedComponent();
          sub = testedComponent.close.subscribe(onCloseEvent);
        });

        afterEach(() => {
          sub.unsubscribe();
        });

        it('should emit a close event', () => {
          const btn = closeBtn.nativeElement as HTMLElement;
          btn.click();
          expect(hasEmitted).toBeTrue();
        });
      });
    });

    it('should display the photo-fullscreen component', () => {
      const photoFullscreenComponent = testUtils.getEltBySelector(
        'app-photo-fullscreen'
      );
      expect(photoFullscreenComponent).toBeTruthy();
    });

    it('should display the photo-metadata component with the selected photo', () => {
      const photoMetadataComp =
        testUtils.getEltBySelector('app-photo-metadata');
      expect(photoMetadataComp.nativeElement).toBeTruthy();

      const compInstance: PhotoMetadataStubComponent =
        photoMetadataComp.componentInstance;
      expect(compInstance.photoMetadata()).toEqual(selectedPhoto.metadata);
    });

    it('should display the photo-selection component', () => {
      const photoSelectionComp = testUtils.getEltBySelector(
        'app-photo-selection'
      );

      expect(photoSelectionComp).toBeTruthy();
    });
  });
});
