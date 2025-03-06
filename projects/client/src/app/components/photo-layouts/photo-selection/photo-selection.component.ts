import {
  Component,
  Inject,
  Input,
  model,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  IPhoto,
  IPhotoSelector,
  PHOTO_SELECTOR_SERVICE_TOKEN,
} from '@shared/photo-context';
import { PhotoImageComponent } from '../photo-image/photo-image.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-photo-selection',
  imports: [PhotoImageComponent],
  templateUrl: './photo-selection.component.html',
  styleUrl: './photo-selection.component.scss',
})
export class PhotoSelectionComponent implements OnInit, OnDestroy {
  @Input() photos: IPhoto[] = [];
  readonly selectedPhoto = model<IPhoto | undefined>(undefined);
  private readonly subs: Subscription[] = [];

  constructor(
    @Inject(PHOTO_SELECTOR_SERVICE_TOKEN)
    private readonly photoSelectorService: IPhotoSelector
  ) {}

  ngOnInit(): void {
    this.subToSelectedPhoto();
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

  private subToSelectedPhoto(): void {
    const sub = this.photoSelectorService.selectedPhoto.subscribe(
      (selectedPhoto) => this.onSelectedPhotoChange(selectedPhoto)
    );
    this.subs.push(sub);
  }

  private onSelectedPhotoChange(photo: IPhoto | undefined): void {
    this.selectedPhoto.set(photo);
  }

  selectPhoto(id: IPhoto['_id']): void {
    const photo = this.photos.find((p) => p._id === id);
    this.photoSelectorService.selectedPhoto.next(photo);
  }
}
