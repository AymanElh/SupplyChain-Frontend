import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should toggle theme from light to dark and back', () => {
    const initialMode = service.isDarkMode();
    service.toggleTheme();
    expect(service.isDarkMode()).toBe(!initialMode);
    expect(localStorage.getItem('scx_theme')).toBe(!initialMode ? 'dark' : 'light');

    service.toggleTheme();
    expect(service.isDarkMode()).toBe(initialMode);
    expect(localStorage.getItem('scx_theme')).toBe(initialMode ? 'dark' : 'light');
  });
});
