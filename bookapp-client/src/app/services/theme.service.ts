import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly storageKey = 'bookapp_theme';

  theme: Theme = localStorage.getItem(this.storageKey) === 'dark' ? 'dark' : 'light';

  constructor() {
    this.applyTheme();
  }

  toggle(): void {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem(this.storageKey, this.theme);
    this.applyTheme();
  }

  private applyTheme(): void {
    this.document.documentElement.setAttribute('data-bs-theme', this.theme);
  }
}
