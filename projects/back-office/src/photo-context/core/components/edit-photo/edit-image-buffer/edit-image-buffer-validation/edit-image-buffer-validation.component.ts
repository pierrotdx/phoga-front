import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { IPhotoVM } from '@back-office/photo-context/core/models';
import { Buffer } from 'buffer';

@Component({
  selector: 'app-edit-image-buffer-validation',
  imports: [],
  templateUrl: './edit-image-buffer-validation.component.html',
})
export class EditImageBufferValidationComponent {
  private readonly maxWeightInBytes = 1000000;

  private _viewModel: IPhotoVM['imageBuffer'];
  @Input() set viewModel(value: IPhotoVM['imageBuffer']) {
    this._viewModel = value;
    this.update();
  }
  get viewModel() {
    return this._viewModel;
  }
  @Output() isValid = new EventEmitter<boolean>(false);

  private readonly state: {
    required: boolean;
    underMaxWeight?: boolean;
  } = {
    required: false,
  };
  readonly validityState = signal(this.state);

  private update(): void {
    this.state.required = !!this.viewModel;
    this.state.underMaxWeight = this.state.required
      ? !!this.viewModel &&
        Buffer.byteLength(this.viewModel) < this.maxWeightInBytes
      : undefined;
    this.validityState.set(this.state);
    const valid = this.state.required && !!this.state.underMaxWeight;
    this.isValid.emit(valid);
  }
}
