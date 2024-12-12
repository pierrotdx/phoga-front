import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'bufferToImage$',
})
export class BufferToImagePipe implements PipeTransform {
  async transform(value: Buffer): Promise<string> {
    const image$ = this.getImagePromise(value);
    return await image$;
  }

  private getImagePromise = (imageBuffer: Buffer): Promise<string> =>
    new Promise(function (resolve, reject) {
      if (!imageBuffer) {
        reject(new Error('no buffer provided in input'));
      }
      const fileReader = new FileReader();
      const blob = new Blob([imageBuffer]);
      fileReader.onloadend = () => {
        resolve(fileReader.result as string);
      };
      fileReader.onerror = (err) => {
        reject(err);
      };
      fileReader.readAsDataURL(blob);
    });
}
