import { Component, input, computed, signal, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemedImage } from '../themed-image/themed-image';
import type { ProductCardData } from '../../models/product.model';
import { BasketService } from '../../services/basket.service';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink, ThemedImage],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  product = input.required<ProductCardData>();
  hideSeriesLink = input(false);

  private liked = signal(false);
  isLiked = this.liked.asReadonly();

  toggleLike(): void {
    this.liked.update((v) => !v);
  }

  mainImageUrl = computed(() => {
    const image = this.product().product_image.find((img) => img.is_main);
    return image?.image_url ?? null;
  });

  fallbackUrl = computed(() => {
    const slug = this.product().series_product_type.product_type.shape?.slug;
    return slug
      ? `https://fnnyyflzqqvqwanjmnht.supabase.co/storage/v1/object/public/images/shapes/${slug}`
      : 'https://fnnyyflzqqvqwanjmnht.supabase.co/storage/v1/object/public/images/shapes/serie';
  });

  private basketService = inject(BasketService);

  addToBasket(event: Event) {
    event.stopPropagation();
    const p = this.product();
    this.basketService.add({
      productId: p.id,
      name: `${p.series_variant.series.name} ${p.series_variant.name} ${p.series_product_type.product_type.name}`,
      price: p.price,
      imageUrl: this.mainImageUrl(),
      shapeSlug: p.series_product_type.product_type.shape?.slug ?? null,
    });
  }
}
