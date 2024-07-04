import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ThemeService } from '../../../core/services/theme.service';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'app-theme-toggle',
  template: `
    <button appButton [appButtonText]="buttonText$ | async" [appButtonIcon]="buttonIcon$ | async" (click)="toggleTheme()"></button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThemeToggleComponent implements OnInit {
  private themeService = inject(ThemeService);

  darkMode$: Observable<boolean>;
  buttonText$: Observable<string>;
  buttonIcon$: Observable<IconDefinition>;
  faMoon = faMoon;
  faSun = faSun;

  ngOnInit(): void {
    this.darkMode$ = this.themeService.darkMode$;
    this.buttonText$ = this.darkMode$.pipe(map((isDarkMode) => (isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode')));
    this.buttonIcon$ = this.darkMode$.pipe(map((isDarkMode) => (isDarkMode ? this.faSun : this.faMoon)));
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
