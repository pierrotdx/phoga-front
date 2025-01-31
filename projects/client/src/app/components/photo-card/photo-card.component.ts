import { AsyncPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IPhoto } from '@shared/photo-context';
import { BufferToImagePipe } from '@shared/pipes';
import { PhotoMetadataComponent } from './photo-metadata/photo-metadata.component';

@Component({
  selector: 'app-photo-card',
  imports: [BufferToImagePipe, AsyncPipe, PhotoMetadataComponent],
  templateUrl: './photo-card.component.html',
})
export class PhotoCardComponent  {
  @Input() photo!: IPhoto;
}
