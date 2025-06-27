import { Theme } from './themes';

export interface IThemeSelectionService {
  getTheme(): Theme;
  select(theme: string): void;
}
