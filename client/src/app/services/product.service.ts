import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { ProductCardData } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);

  getFeatured() {
    return this.http.get<ProductCardData[]>('/api/products/featured');
  }
}