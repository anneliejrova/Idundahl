import { Component, input, computed } from '@angular/core';
import { ProductCard } from '../product-card/product-card';
import type { SimilarProduct } from '../../models/product.model';

@Component({
  selector: 'app-similar-products',
  imports: [ProductCard],
  templateUrl: './similar-products.html',
  styleUrl: './similar-products.css',
})
export class SimilarProducts {
  allProducts = input.required<SimilarProduct[]>();
 products = computed(() => this.allProducts().slice(0, 5));
}
