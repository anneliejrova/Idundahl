import { Component, inject, signal, effect, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProductService } from '../../services/product.service';
import type { AdminProductRow } from '../../models/product.model';

@Component({
  imports: [],
  selector: 'app-admin-product-list',
  styleUrl: './admin-product-list.css',
  templateUrl: './admin-product-list.html',
})
export class AdminProductList {
  private productService = inject(ProductService);

  private fetchedProducts = toSignal(this.productService.getAll(), { initialValue: [] });

  products = signal<AdminProductRow[]>([]);
  filterQuery = signal('');

  filteredProducts = computed(() => {
    const query = this.filterQuery().toLowerCase().trim();
    if (!query) return this.products();

    return this.products().filter((product) =>
      product.name.toLowerCase().includes(query) ||
      product.series_variant.series.name.toLowerCase().includes(query)
    );
  });

  constructor() {
    effect(() => {
      this.products.set(this.fetchedProducts());
    });
  }

  onDelete(product: AdminProductRow) {
    if (!confirm(`Ta bort "${product.name}"? Detta går inte att ångra.`)) {
      return;
    }
    this.productService.deleteProduct(product.id).subscribe(() => {
      this.products.update((products) => products.filter((p) => p.id !== product.id));
    });
  }
}