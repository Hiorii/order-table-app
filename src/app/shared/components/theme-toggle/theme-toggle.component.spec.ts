import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ThemeToggleComponent } from './theme-toggle.component';
import { ThemeService } from '../../../core/services/theme.service';
import { of } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ButtonDirective } from '../button/button.directive';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';

describe('ThemeToggleComponent', () => {
  let component: ThemeToggleComponent;
  let fixture: ComponentFixture<ThemeToggleComponent>;
  let themeService: jest.Mocked<ThemeService>;

  beforeEach(async () => {
    const themeServiceMock = {
      darkMode$: of(true),
      toggleTheme: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [ThemeToggleComponent, ButtonDirective, IconComponent],
      providers: [{ provide: ThemeService, useValue: themeServiceMock }],
      imports: [CommonModule, FontAwesomeModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ThemeToggleComponent);
    component = fixture.componentInstance;
    themeService = TestBed.inject(ThemeService) as jest.Mocked<ThemeService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize observables on init', () => {
    component.ngOnInit();
    component.darkMode$.subscribe((isDarkMode) => {
      expect(isDarkMode).toBe(true);
    });
    component.buttonText$.subscribe((text) => {
      expect(text).toBe('Switch to Light Mode');
    });
    component.buttonIcon$.subscribe((icon) => {
      expect(icon).toBe(component.faSun);
    });
  });

  it('should toggle theme when button is clicked', () => {
    const button = fixture.nativeElement.querySelector('button');
    button.click();
    expect(themeService.toggleTheme).toHaveBeenCalled();
  });

  it('should display correct button text and icon based on dark mode', () => {
    component.ngOnInit();
    fixture.detectChanges();

    component.buttonText$.subscribe((text) => {
      expect(text).toBe('Switch to Light Mode');
    });

    component.buttonIcon$.subscribe((icon) => {
      expect(icon).toBe(component.faSun);
    });

    themeService.darkMode$ = of(false); // Simulate switching to light mode
    fixture.detectChanges();

    component.buttonText$.subscribe((text) => {
      expect(text).toBe('Switch to Dark Mode');
    });

    component.buttonIcon$.subscribe((icon) => {
      expect(icon).toBe(component.faMoon);
    });
  });
});
