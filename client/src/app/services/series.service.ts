import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import type { SeriesModel } from '../models/series.model';

@Injectable({ providedIn: 'root' })
export class SeriesService {
  private http = inject(HttpClient);

  getAll(): Observable<SeriesModel[]> {
    return this.http.get<SeriesModel[]>('/api/series');
  }

  getByCategory(categorySlug: string): Observable<SeriesModel[]> {
    return this.http.get<SeriesModel[]>(`/api/series?category=${categorySlug}`);
  }
}