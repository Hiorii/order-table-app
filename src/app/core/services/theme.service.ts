import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DarkModeEnum } from '../enums/dark-mode.enum';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkModeSubject = new BehaviorSubject<boolean>(this.getInitialTheme());
  public darkMode$ = this.darkModeSubject.asObservable();
  private darkModeLocalStorageKey = 'darkMode';

  constructor() {
    this.updateBodyClass();
  }

  isDarkMode(): boolean {
    return this.darkModeSubject.value;
  }

  toggleTheme(): void {
    const newDarkMode = !this.isDarkMode();
    this.darkModeSubject.next(newDarkMode);
    localStorage.setItem(this.darkModeLocalStorageKey, newDarkMode.toString());
    this.updateBodyClass();
  }

  private updateBodyClass(): void {
    if (this.isDarkMode()) {
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
