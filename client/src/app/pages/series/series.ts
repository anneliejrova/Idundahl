import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SeriesCard } from '../../components/series-card/series-card';
import { Grid } from '../../components/grid/grid';
import { SeriesService } from '../../services/series.service';

@Component({
  imports: [SeriesCard, Grid],
  selector: 'app-series',
  styleUrl: './series.css',
  templateUrl: './series.html',
})
export class Series {
  private seriesService = inject(SeriesService);
  allSeries = toSignal(this.seriesService.getAll(), { initialValue: [] });
}
