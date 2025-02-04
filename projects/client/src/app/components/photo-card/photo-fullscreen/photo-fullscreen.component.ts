import { AsyncPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MaterialIconComponent } from '@shared/material-icon';
import { Photo } from '@shared/photo-context';
import { BufferToImagePipe } from '@shared/pipes';

@Component({
  selector: 'app-photo-fullscreen',
  imports: [AsyncPipe, BufferToImagePipe, MaterialIconComponent],
  templateUrl: './photo-fullscreen.component.html',
})
export class PhotoFullscreenComponent {
  @Input() imageBuffer: Photo['imageBuffer'];
  @Input() show = false;
  @Output() closed = new EventEmitter<void>();

  onClose(): void {
    this.closed.emit();
  }
}
