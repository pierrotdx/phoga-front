import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  viewChild,
} from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { IPhoto } from '@shared/photo-context';
import { MetadataFormComponent } from './metadata-form/metadata-form.component';
import { Subscription } from 'rxjs';
import { IPhotoVM } from '../../models';

@Component({
  selector: 'app-edit-photo-form',
  imports: [FormsModule, MetadataFormComponent],
  templateUrl: './edit-photo-form.component.html',
})
export class EditPhotoFormComponent implements AfterViewInit, OnDestroy {
  private formSub: Subscription | undefined;
  private _photo!: IPhoto;

  @Input() set photo(value: IPhoto) {
    this._photo = value;
    this.initViewModel();
  }
  get photo() {
    return this._photo;
  }

  form = viewChild<NgModel>('editPhotoForm');
  viewModel: IPhotoVM | undefined;

  ngAfterViewInit(): void {
    this.subscribeToForm();
  }

  ngOnDestroy(): void {
    this.formSub?.unsubscribe();
  }

  private initViewModel(): void {
    this.viewModel = {
      metadata: {
        description: this.photo.metadata?.description || '',
        location: this.photo.metadata?.location || '',
        titles: this.photo.metadata?.titles || [],
      },
    };
  }

  private subscribeToForm(): void {
    const form = this.form();
    if (!form) {
      throw new Error('form not displayed');
    }
    this.formSub = form.valueChanges?.subscribe((value) =>
      this.onFormChange(value)
    );
  }

  private onFormChange(value: unknown): void {
    console.log('form change: ', value);
  }

  logForm() {
    console.log('form', this.form()?.control);
  }

  onSubmit(): void {
    console.log('submitted', this.viewModel);
  }
}
