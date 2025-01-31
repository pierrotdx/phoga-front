import { Component, Input } from '@angular/core';

@Component({
  selector: 'lib-material-icon',
  imports: [],
  template: `<span class="material-symbols-outlined">{{ iconName }}</span>`,
})
export class MaterialIconComponent {
  @Input() iconName!: string;
}
