import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Hero } from '../../components/hero/hero';
import { Grid } from '../../components/grid/grid';
import { SeriesService } from '../../services/series.service';
import { ProductService } from '../../services/product.service';
import { ProductCard } from '../../components/product-card/product-card';
import { Spots } from '../../components/spots/spots';

@Component({
  selector: 'app-home',
  imports: [Hero, Grid, ProductCard, Spots],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private seriesService = inject(SeriesService);
  private productService = inject(ProductService);

  allSeries = toSignal(this.seriesService.getAll(), { initialValue: [] });
  featuredProducts = toSignal(this.productService.getFeatured(), { initialValue: [] }); 
} 