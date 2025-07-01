import {
  Component,
  effect,
  EventEmitter,
  input,
  Output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ITagVM } from '../../models';
import { ITag } from '@shared/public-api';

@Component({
  selector: 'app-edit-tag-form',
  imports: [FormsModule],
  templateUrl: './edit-tag-form.component.html',
})
export class EditTagFormComponent {
  tag = input<ITag>();

  viewModel: ITagVM = { name: '' };
  isValid = signal<boolean>(false);

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
    this.save.emit(this.viewModel);
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
