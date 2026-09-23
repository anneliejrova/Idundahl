import { Component, inject, computed, effect } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { ThemedImage } from '../../components/themed-image/themed-image';
import { SimilarProducts } from '../../components/similar-products/similar-products';
import { ProductService } from '../../services/product.service';
import { BasketService } from '../../services/basket.service';

@Component({
  selector: 'app-product-detail',
  imports: [ThemedImage, SimilarProducts, RouterLink],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private title = inject(Title);
  private basketService = inject(BasketService);

  product = toSignal(
    this.route.paramMap.pipe(
      switchMap((params) => this.productService.getBySlug(params.get('slug')!)),
    ),
    { initialValue: null },
  );

  mainImageUrl = computed(() => {
    const p = this.product();
    return p?.product_image.find((img) => img.is_main)?.image_url ?? null;
  });

  fallbackUrl = computed(() => {
    const slug = this.product()?.series_product_type.product_type.shape?.slug;
    return slug
      ? `https://fnnyyflzqqvqwanjmnht.supabase.co/storage/v1/object/public/images/shapes/${slug}`
      : 'https://fnnyyflzqqvqwanjmnht.supabase.co/storage/v1/object/public/images/shapes/serie';
  });

  constructor() {
    effect(() => {
      const p = this.product();
      if (p) this.title.setTitle(p.name);
    });
  }

  addToBasket() {
  const p = this.product();
  if (!p) return;
  this.basketService.add({
    productId: p.id,
    name: `${p.series_variant.series.name} ${p.series_variant.name} ${p.series_product_type.product_type.name}`,
    price: p.price,
    imageUrl: this.mainImageUrl(),
    shapeSlug: p.series_product_type.product_type.shape?.slug ?? null,
  });
}
}

