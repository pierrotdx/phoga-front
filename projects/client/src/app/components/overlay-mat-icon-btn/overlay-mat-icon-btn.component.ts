import { Component, EventEmitter, model, Output } from '@angular/core';
import { MaterialIconComponent } from '@shared/material-icon-component';

@Component({
  selector: 'app-overlay-mat-icon-btn',
  imports: [MaterialIconComponent],
  templateUrl: './overlay-mat-icon-btn.component.html',
  styleUrl: './overlay-mat-icon-btn.component.scss',
})
export class OverlayMatIconBtnComponent {
  @Output() click = new EventEmitter<void>();

  onClick() {
    this.click.emit();
  }
}
