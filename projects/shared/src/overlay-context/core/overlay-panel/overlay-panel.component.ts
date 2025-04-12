import { Component, model } from '@angular/core';

@Component({
  selector: 'app-overlay-panel',
  imports: [],
  templateUrl: './overlay-panel.component.html',
  styleUrl: './overlay-panel.component.scss',
})
export class OverlayPanelComponent {
  show = model<boolean>(false);
}
