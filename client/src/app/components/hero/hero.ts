import { Component, OnInit, signal, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeriesService } from '../../services/series.service';
import type { Series } from '../../models/series.model';

@Component({
  selector: 'app-hero',
  imports: [RouterLink],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero implements OnInit {
  private seriesService = inject(SeriesService);
  heroSeries = signal<Series | null>(null);

  ngOnInit() {
    this.seriesService.getAll().subscribe((allSeries) => {
      const withMood = allSeries.filter((s) => s.mood_image_url !== null);
      if (withMood.length === 0) return;
      const randomIndex = Math.floor(Math.random() * withMood.length);
      this.heroSeries.set(withMood[randomIndex]);
    });
  }

  firstParagraph(text: string | null): string {
    if (!text) return '';
    return text.split('\n\n')[0];
  }
}
