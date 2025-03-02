import { PhotoSelectorService } from './photo-selector.service';

describe('PhotoSelectorService', () => {
  let photoSelectorService: PhotoSelectorService;

  beforeEach(() => {
    photoSelectorService = new PhotoSelectorService();
  });

  describe('selectedPhoto', () => {
    it('should be defined', () => {
      const result = photoSelectorService.selectedPhoto;
      expect(result).toBeDefined();
    });
  });
});
