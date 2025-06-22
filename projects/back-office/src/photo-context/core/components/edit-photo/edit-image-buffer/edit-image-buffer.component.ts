import { AsyncPipe } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  viewChild,
} from '@angular/core';
import { BufferToImagePipe } from '@shared/pipes';
import { IPhotoVM } from '../../../models';
import { Buffer } from 'buffer';
import { Subscription } from 'rxjs';
import { EditImageBufferValidationComponent } from './edit-image-buffer-validation/edit-image-buffer-validation.component';
import { IPhoto } from '@shared/photo-context';

@Component({
  selector: 'app-edit-image-buffer',
  imports: [AsyncPipe, BufferToImagePipe, EditImageBufferValidationComponent],
  templateUrl: './edit-image-buffer.component.html',
})
export class EditImageBufferComponent implements OnInit, OnDestroy {
  private subs: Subscription[] = [];
  private initViewModel: IPhotoVM['imageBuffer'];

  @Input() initImageUrl: IPhoto['imageUrl'];
  @Input() viewModel: IPhotoVM['imageBuffer'];
  @Output() viewModelChange = new EventEmitter<IPhotoVM['imageBuffer']>();
  @Input() cancel: EventEmitter<void> | undefined;
  @Output() isValid = new EventEmitter<boolean>(false);

  private useFullSizeImg = false;
  private defaultImgWidthInPct = 20 * 1000000;
  imgWidthInPct = this.defaultImgWidthInPct;

  imageBufferInput =
    viewChild<ElementRef<HTMLInputElement>>('imageBufferInput');

  ngOnInit(): void {
    const cancelSub = this.cancel?.subscribe(() => {
      this.reset();
    });
    if (cancelSub) {
      this.subs.push(cancelSub);
    }
    this.initViewModel = this.viewModel;
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  onImgClick(): void {
    this.useFullSizeImg = !this.useFullSizeImg;
    this.setImgSize();
  }

  private setImgSize(): void {
    this.imgWidthInPct = this.useFullSizeImg ? 100 : this.defaultImgWidthInPct;
  }

  deleteImage(): void {
    this.clearInput();
    this.viewModelChange.emit(undefined);
  }

  reset(): void {
    this.clearInput();
    this.viewModel = this.initViewModel;
  }

  private clearInput(): void {
    const inputElement = this.imageBufferInput();
    if (inputElement) {
      inputElement.nativeElement.value = '';
    }
  }

  async onFileSelection(event: Event): Promise<void> {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file || file.type === 'cancel') {
      return;
    }
    const viewModel = await this.getBufferFromFile(file);
    this.viewModelChange.emit(viewModel);
  }

  private async getBufferFromFile(file: File): Promise<Buffer> {
    const arrayBuffer = await file.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  onFileSelectionCancel(event: Event): void {
    // prevents triggering form-edition cancel:
    // https://github.com/angular/angular/issues/4059
    event.stopPropagation();
  }
}
