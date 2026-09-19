import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import type { Series } from '../models/series.model';

@Injectable({ providedIn: 'root' })
export class SeriesService {
  private http = inject(HttpClient);

  getAll(): Observable<Series[]> {
    return this.http.get<Series[]>('/api/series');
  }
}