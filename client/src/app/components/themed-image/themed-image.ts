import { Component, input, signal, computed, inject } from '@angular/core';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-themed-image',
  template: `<img [src]="currentSrc()" [alt]="alt()" [class.is-fallback]="isFallback()" (error)="onError()" />`,
  styleUrl: './themed-image.css',
})
export class ThemedImage {
  private theme = inject(ThemeService);
  baseUrl = input.required<string | null>();
  fallbackUrl = input.required<string>();
  alt = input('');

  private failedDark = signal(false);
  private failedBase = signal(false);

  isFallback = computed(() => !this.baseUrl() || this.failedBase());

  currentSrc = computed(() => {
    const activeBase = this.isFallback() ? this.fallbackUrl() : this.baseUrl()!;
    const wantsDark = this.theme.isDarkMode() && !this.failedDark();
    return wantsDark ? `${activeBase}_dark.webp` : `${activeBase}.webp`;
  });

  onError() {
    if (this.theme.isDarkMode() && !this.failedDark()) {
      this.failedDark.set(true);
      return;
    }
    if (!this.failedBase()) {
      this.failedBase.set(true);
      this.failedDark.set(false);
      return;
    }
  }
}