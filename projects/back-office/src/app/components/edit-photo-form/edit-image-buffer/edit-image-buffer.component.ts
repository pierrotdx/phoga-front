import { AsyncPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { BufferToImagePipe } from '@shared/pipes';
import { IPhotoVM } from '../../../models';
import { Buffer } from 'buffer';

@Component({
  selector: 'app-edit-image-buffer',
  imports: [AsyncPipe, BufferToImagePipe],
  templateUrl: './edit-image-buffer.component.html',
})
export class EditImageBufferComponent {
  @Input() viewModel!: IPhotoVM['imageBuffer'];

  private useFullSizeImg = false;
  private defaultImgPreviewMaxWidthInPct = 20;
  imgPreviewMaxWidthInPct = this.defaultImgPreviewMaxWidthInPct;

  reset(): void {
    if (this.viewModel) {
      this.viewModel = null;
    }
  }

  async onFileSelection(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) {
      return;
    }
    this.viewModel = await this.getBufferFromFile(file);
  }

  private async getBufferFromFile(file: File): Promise<Buffer> {
    const arrayBuffer = await file.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  onImgPreviewClick(): void {
    this.useFullSizeImg = !this.useFullSizeImg;
    this.setImgSize();
  }

  private setImgSize(): void {
    this.imgPreviewMaxWidthInPct = this.useFullSizeImg
      ? 100
      : this.defaultImgPreviewMaxWidthInPct;
  }
}
