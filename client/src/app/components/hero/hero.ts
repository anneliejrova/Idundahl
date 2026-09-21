import { Component, input, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeriesModel } from '../../models/series.model';

@Component({
  selector: 'app-hero',
  imports: [RouterLink],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero {
  allSeries = input.required<SeriesModel[]>();

  heroSeries = computed(() => {
    const withMood = this.allSeries().filter((s) => s.mood_image_url !== null);
    if (withMood.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * withMood.length);
    return withMood[randomIndex];
  });

  firstParagraph(text: string | null): string {
    if (!text) return '';
    return text.split('\n\n')[0];
  }
}