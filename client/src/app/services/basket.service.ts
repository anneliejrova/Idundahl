import { Injectable, signal, effect } from '@angular/core';
import type { BasketItem } from '../models/basket.model';

const STORAGE_KEY = 'idundahl-basket';

@Injectable({ providedIn: 'root' })
export class BasketService {
  private items = signal<BasketItem[]>(this.loadFromStorage());

  readonly itemsReadonly = this.items.asReadonly();

  totalCount = signal(0);
  totalPrice = signal(0);

  constructor() {
    effect(() => {
      const currentItems = this.items();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentItems));
      this.totalCount.set(currentItems.reduce((sum, i) => sum + i.quantity, 0));
      this.totalPrice.set(currentItems.reduce((sum, i) => sum + i.quantity * i.price, 0));
    });
  }

  private loadFromStorage(): BasketItem[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  add(item: Omit<BasketItem, 'quantity'>) {
    this.items.update((current) => {
      const existing = current.find((i) => i.productId === item.productId);
      if (existing) {
        return current.map((i) =>
          i.productId === item.productId ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [...current, { ...item, quantity: 1 }];
    });
  }

  updateQuantity(productId: string, quantity: number) {
    if (quantity <= 0) {
      this.remove(productId);
      return;
    }
    this.items.update((current) =>
      current.map((i) => (i.productId === productId ? { ...i, quantity } : i)),
    );
  }

  remove(productId: string) {
    this.items.update((current) => current.filter((i) => i.productId !== productId));
  }
}