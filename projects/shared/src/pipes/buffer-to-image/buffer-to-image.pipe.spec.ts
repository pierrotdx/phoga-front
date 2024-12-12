import { BufferToImagePipe } from './buffer-to-image.pipe';
import { Buffer } from 'buffer';

describe('BufferToImagePipe', () => {
  let pipe: BufferToImagePipe;

  beforeEach(() => {
    pipe = new BufferToImagePipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should convert a buffer into string', async () => {
    const buffer = Buffer.from('lorem ipsum');
    const result = await pipe.transform(buffer);
    expect(typeof result).toBe('string');
    expect(result).toBeInstanceOf(String);
  });
});
