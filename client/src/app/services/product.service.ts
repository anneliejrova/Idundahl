import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { ProductCardData, AdminProductRow, CreateProductInput } from '../models/product.model';

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

  getAll() {
    return this.http.get<AdminProductRow[]>('/api/products');
  }

  deleteProduct(id: string) {
    return this.http.delete<void>(`/api/products/${id}`);
  }

  createProduct(input: CreateProductInput) {
  return this.http.post<AdminProductRow>('/api/products', input);
}
}

