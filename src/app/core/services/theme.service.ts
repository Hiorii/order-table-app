import { Injectable } from '@angular/core';
import { DarkModeEnum } from '../enums/dark-mode.enum';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkMode: boolean;
  private darkModeLocalStorageKey = 'darkMode';

  constructor() {
    this.darkMode = this.getInitialTheme();
    this.updateBodyClass();
  }

  isDarkMode(): boolean {
    return this.darkMode;
  }

  toggleTheme(): void {
    this.darkMode = !this.darkMode;
    localStorage.setItem(this.darkModeLocalStorageKey, this.darkMode.toString());
    this.updateBodyClass();
  }

  private updateBodyClass(): void {
    if (this.darkMode) {
      document.body.classList.add(DarkModeEnum.dark);
      document.body.classList.remove(DarkModeEnum.light);
    } else {
      document.body.classList.add(DarkModeEnum.light);
      document.body.classList.remove(DarkModeEnum.dark);
    }
  }

  private getInitialTheme(): boolean {
    const storedTheme = localStorage.getItem(this.darkModeLocalStorageKey);
    if (storedTheme !== null) {
      return storedTheme === 'true';
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
}
