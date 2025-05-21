import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  input,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'app-overlay-panel',
  imports: [],
  templateUrl: './overlay-panel.component.html',
  styleUrl: './overlay-panel.component.scss',
})
export class OverlayPanelComponent implements AfterViewInit {
  dialog = viewChild<ElementRef<HTMLDialogElement>>('overlay');

  show = input<boolean>(false);

  constructor() {
    effect(this.toggleDialog);
  }

  ngAfterViewInit(): void {
    this.toggleDialog();
  }

  toggleDialog = () => {
    const show = this.show();
    const dialogElt = this.dialog()?.nativeElement;
    if (!dialogElt) {
      return;
    }
    if (show) {
      dialogElt.showModal();
    } else {
      dialogElt.close();
    }
  };
}
