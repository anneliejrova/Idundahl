import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { SeriesCard } from '../../components/series-card/series-card';
import { Grid } from '../../components/grid/grid';
import { SeriesService } from '../../services/series.service';
import { categoryUrlToSlug } from '../../constants/category-slugs';

@Component({
  selector: 'app-category',
  imports: [SeriesCard, Grid],
  templateUrl: './category.html',
  styleUrl: './category.css',
})
export class Category {
  private route = inject(ActivatedRoute);
  private seriesService = inject(SeriesService);

  series = toSignal(
    this.route.paramMap.pipe(
      switchMap((params) => {
        const urlSlug = params.get('slug')!;
        const dbSlug = categoryUrlToSlug[urlSlug] ?? urlSlug;
        return this.seriesService.getByCategory(dbSlug);
      }),
    ),
    { initialValue: [] },
  );
}