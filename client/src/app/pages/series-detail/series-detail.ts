import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { ProductCard } from '../../components/product-card/product-card';
import { Grid } from '../../components/grid/grid';
import { SeriesService } from '../../services/series.service';

@Component({
  selector: 'app-series-detail',
  imports: [ProductCard, Grid],
  templateUrl: './series-detail.html',
  styleUrl: './series-detail.css',
})
export class SeriesDetail {
  private route = inject(ActivatedRoute);
  private seriesService = inject(SeriesService);

  series = toSignal(
    this.route.paramMap.pipe(
      switchMap((params) => this.seriesService.getBySlug(params.get('slug')!)),
    ),
    { initialValue: null },
  );
}
