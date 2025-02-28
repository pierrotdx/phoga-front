import { IPhoto } from '../models';
import { PhotoUtilsService } from './photo-utils.service';

describe('PhotoUtilsService', () => {
  let photoUtilsService: PhotoUtilsService;

  beforeEach(() => {
    photoUtilsService = new PhotoUtilsService();
  });

  describe('getTitle', () => {
    let metadata: IPhoto['metadata'];

    it('should return the first title available from the metadata', () => {
      const expectedTitle = 'dumb title';
      metadata = { titles: [expectedTitle] };
      const result = photoUtilsService.getTitle(metadata);
      expect(result).toBe(expectedTitle);
    });

    it('should return `undefined` if there is no title in the metadata', () => {
      metadata = {};
      const result = photoUtilsService.getTitle(metadata);
      expect(result).toBeUndefined();
    });

    it('should return `undefined` if the titles list in the metadata is empty', () => {
      metadata = { titles: [] };
      const result = photoUtilsService.getTitle(metadata);
      expect(result).toBeUndefined();
    });
  });
});
