import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';
import { DarkModeEnum } from '../enums/dark-mode.enum';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
  });

  afterEach(() => {
    localStorage.clear();
    document.body.classList.remove(DarkModeEnum.dark, DarkModeEnum.light);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with dark mode if localStorage is set to true', () => {
    localStorage.setItem('darkMode', 'true');
    const newService = new ThemeService();
    expect(newService.isDarkMode()).toBe(true);
    expect(document.body.classList).toContain(DarkModeEnum.dark);
  });

  it('should initialize with light mode if localStorage is set to false', () => {
    localStorage.setItem('darkMode', 'false');
    const newService = new ThemeService();
    expect(newService.isDarkMode()).toBe(false);
    expect(document.body.classList).toContain(DarkModeEnum.light);
  });

  it('should toggle the theme and update localStorage and body class', () => {
    service.toggleTheme();
    expect(service.isDarkMode()).toBe(true);
    expect(localStorage.getItem('darkMode')).toBe('true');
    expect(document.body.classList).toContain(DarkModeEnum.dark);
    expect(document.body.classList).not.toContain(DarkModeEnum.light);

    service.toggleTheme();
    expect(service.isDarkMode()).toBe(false);
    expect(localStorage.getItem('darkMode')).toBe('false');
    expect(document.body.classList).toContain(DarkModeEnum.light);
    expect(document.body.classList).not.toContain(DarkModeEnum.dark);
  });

  it('should initialize with system theme if localStorage is not set', () => {
    const matchMediaMock = jest.fn().mockImplementation((query) => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn()
    }));

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: matchMediaMock
    });

    const newService = new ThemeService();
    expect(newService.isDarkMode()).toBe(true);
    expect(document.body.classList).toContain(DarkModeEnum.dark);
  });
});
