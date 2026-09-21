import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemedImage } from '../themed-image/themed-image';
import { SeriesModel } from '../../models/series.model';

@Component({
  selector: 'app-series-card',
  imports: [RouterLink, ThemedImage],
  templateUrl: './series-card.html',
  styleUrl: './series-card.css',
})
export class SeriesCard {
  series = input.required<SeriesModel>();
}