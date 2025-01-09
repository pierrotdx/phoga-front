import { IPhoto, Photo } from '@shared/photo-context';
import { PhotoItemTestUtils } from './photo-item.test-utils';
import { Buffer } from 'buffer';

describe('PhotoItemComponent', () => {
  let testUtils: PhotoItemTestUtils;

  beforeEach(async () => {
    testUtils = new PhotoItemTestUtils();
    await testUtils.beforeEachGlobal();
  });

  it('should create', () => {
    expect(testUtils.component).toBeTruthy();
  });

  describe('when there is no photo', () => {
    beforeEach(() => {
      testUtils.setPhoto(undefined);
    });

    it('should display the no-photo container', () => {
      const noPhotoContainerId = 'no-photo';
      testUtils.expectElementToBeDisplayed(noPhotoContainerId);
    });
  });

  describe('when there is a photo', () => {
    let photo: IPhoto;

    describe('that does not have a thumbnail', () => {
      beforeEach(() => {
        photo = new Photo('dumb id');
        testUtils.setPhoto(photo);
      });

      it('should display the photo id', () => {
        const photoId = 'photo-id';
        testUtils.expectElementToBeDisplayed(photoId);
      });
    });

    describe('that has a thumbnail', () => {
      beforeEach(() => {
        photo = new Photo('dumb id', {
          metadata: { thumbnail: Buffer.from('dumb buffer') },
        });
        testUtils.setPhoto(photo);
      });

      it('should display the thumbnail', () => {
        const thumbnailId = 'thumbnail-container';
        testUtils.expectElementToBeDisplayed(thumbnailId);
      });
    });
  });
});
