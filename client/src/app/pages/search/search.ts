import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { ProductCard } from '../../components/product-card/product-card';
import { Grid } from '../../components/grid/grid';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-search',
  imports: [ProductCard, Grid],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class Search {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);

  result = toSignal(
    this.route.queryParamMap.pipe(
      switchMap((params) => {
        const query = params.get('q') ?? '';
        if (query.trim().length < 2) {
          return [{ count: 0, results: [] }];
        }
        return this.productService.search(query);
      }),
    ),
    { initialValue: { count: 0, results: [] } },
  );
}