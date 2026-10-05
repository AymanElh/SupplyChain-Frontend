import { Injectable, signal, effect } from '@angular/core';

export type ThemeMode = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'scx_theme';
  isDarkMode = signal<boolean>(false);

  constructor() {
    this.initTheme();
    effect(() => {
      const dark = this.isDarkMode();
      if (typeof document !== 'undefined') {
        if (dark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    });
  }

  private initTheme(): void {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem(this.THEME_KEY);
      if (savedTheme) {
        this.isDarkMode.set(savedTheme === 'dark');
      } else {
        const prefersDark = Boolean(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)')?.matches);
        this.isDarkMode.set(prefersDark);
      }
    }
  }

  toggleTheme(): void {
    this.isDarkMode.update(curr => {
      const next = !curr;
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(this.THEME_KEY, next ? 'dark' : 'light');
      }
      return next;
    });
  }
}
