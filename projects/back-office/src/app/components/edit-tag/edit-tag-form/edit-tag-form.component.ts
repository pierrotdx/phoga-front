import {
  Component,
  effect,
  EventEmitter,
  input,
  Output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ITagVM } from '@back-office/app/models';
import { ITag } from '@shared/public-api';

@Component({
  selector: 'app-edit-tag-form',
  imports: [FormsModule],
  templateUrl: './edit-tag-form.component.html',
})
export class EditTagFormComponent {
  tag = input<ITag>();

  viewModel: ITagVM = { name: '' };
  isValid = signal<Boolean>(false);

  @Output() save = new EventEmitter<ITagVM>();
  @Output() cancel = new EventEmitter<void>();

  constructor() {
    effect(() => {
      this.onTagInput();
    });
  }

  private onTagInput(): void {
    const tag = this.tag();
    if (!tag) {
      return;
    }
    this.viewModel = { ...tag };
  }

  onSubmit(): void {
    console.log('emitting viewModel', this.viewModel);
    this.save.emit(this.viewModel);
  }

  onCancel(): void {
    console.log('cancelled');
    this.cancel.emit();
  }
}
