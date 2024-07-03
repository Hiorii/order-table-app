import { Component } from '@angular/core';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  template: ` <app-button
    [text]="themeService.isDarkMode() ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
    (clickBtn)="toggleTheme()"
  ></app-button>`
})
export class ThemeToggleComponent {
  constructor(public themeService: ThemeService) {}

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
