import { Component, model } from '@angular/core';
import { MaterialIconComponent } from '@shared/material-icon';

@Component({
  selector: 'app-overlay',
  imports: [MaterialIconComponent],
  templateUrl: './overlay.component.html',
  styleUrl: './overlay.component.scss',
})
export class OverlayComponent {
  show = model<boolean>(false);

  onClose(): void {
    this.show.set(false);
  }
}
