import { Component, inject } from '@angular/core';
import { ThemedImage } from '../../components/themed-image/themed-image';
import { BasketService } from '../../services/basket.service';

@Component({
  selector: 'app-checkout',
  imports: [ThemedImage],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout {
  basketService = inject(BasketService);

    increase(productId: string, currentQuantity: number) {
    this.basketService.updateQuantity(productId, currentQuantity + 1);
  }

  decrease(productId: string, currentQuantity: number) {
    this.basketService.updateQuantity(productId, currentQuantity - 1);
  }

  remove(productId: string) {
    this.basketService.remove(productId);
  }
}
