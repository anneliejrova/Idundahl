import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import type { SeriesModel } from '../models/series.model';
import type { ProductType } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class SeriesService {
  private http = inject(HttpClient);

  getAll(): Observable<SeriesModel[]> {
    return this.http.get<SeriesModel[]>('/api/series');
  }

  getByCategory(categorySlug: string): Observable<SeriesModel[]> {
    return this.http.get<SeriesModel[]>(`/api/series?category=${categorySlug}`);
  }

  getProductTypes(slug: string): Observable<ProductType[]> {
    return this.http.get<ProductType[]>(`/api/series/${slug}/product-types`);
  }

  getBySlug(slug: string): Observable<SeriesModel> {
    return this.http.get<SeriesModel>(`/api/series/${slug}`);
  }
}