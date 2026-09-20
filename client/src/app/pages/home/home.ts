import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Hero } from '../../components/hero/hero';
import { SeriesCard } from '../../components/series-card/series-card';
import { Grid } from '../../components/grid/grid';
import { SeriesService } from '../../services/series.service';

@Component({
  selector: 'app-home',
  imports: [Hero, SeriesCard, Grid],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private seriesService = inject(SeriesService);
  allSeries = toSignal(this.seriesService.getAll(), { initialValue: [] });
}