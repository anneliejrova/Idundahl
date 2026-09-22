import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { ProductCardData } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);

  getFeatured() {
    return this.http.get<ProductCardData[]>('/api/products/featured');
  }

  search(query: string) {
  return this.http.get<{ count: number; results: ProductCardData[] }>(
    `/api/products/search?q=${encodeURIComponent(query)}`
  );
}
}