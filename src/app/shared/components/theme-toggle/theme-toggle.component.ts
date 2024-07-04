import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../../../core/services/theme.service';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-theme-toggle',
  template: `
    <button
      appButton
      [appButtonText]="(darkMode$ | async) ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
      [appButtonIcon]="(darkMode$ | async) ? faSun : faMoon"
      (click)="toggleTheme()"
    ></button>
  `
})
export class ThemeToggleComponent implements OnInit {
  protected readonly faMoon = faMoon;
  protected readonly faSun = faSun;
  darkMode$: Observable<boolean>;

  constructor(public themeService: ThemeService) {}

  ngOnInit(): void {
    this.darkMode$ = this.themeService.darkMode$;
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
