import { WritableSignal } from '@angular/core';
import { Theme } from './themes';

export interface IThemeSelectionService {
  theme: WritableSignal<Theme>;
}
