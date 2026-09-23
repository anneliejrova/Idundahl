import { Router } from '@angular/router';
import { Component, inject, signal, computed, effect } from '@angular/core';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { switchMap, of } from 'rxjs';
import { form, FormField, validate, validateTree } from '@angular/forms/signals';
import { SeriesService } from '../../services/series.service';
import { ProductService } from '../../services/product.service';
import type { SeriesModel, SeriesVariant } from '../../models/series.model';
import type { ProductType, ProductFormModel, CreateProductInput } from '../../models/product.model';

function positiveNumber(ctx: { value: () => number }) {
  const value = ctx.value();
  if (value <= 0) {
    return { kind: 'mustBePositive', message: 'Måste anges och vara större än 0.' };
  }
  return undefined;
}

function optionalPositiveNumber(ctx: { value: () => string }) {
  const raw = ctx.value();
  if (raw === '') return undefined;

  const num = Number(raw);
  if (isNaN(num) || num <= 0) {
    return { kind: 'invalidMeasurement', message: 'Måste vara ett tal över 0, eller lämnas tomt.' };
  }
  return undefined;
}

@Component({
  selector: 'app-admin-product-form',
  imports: [FormField],
  templateUrl: './admin-product-form.html',
  styleUrl: './admin-product-form.css',
})
export class AdminProductForm {
  private seriesService = inject(SeriesService);
  private productService = inject(ProductService);
  private router = inject(Router);

  // --- Serie: autocomplete ---
  allSeries = toSignal(this.seriesService.getAll(), { initialValue: [] });

  seriesInput = signal('');
  selectedSeries = signal<SeriesModel | null>(null);
  showSuggestions = signal(false);

  suggestions = computed(() => {
    const query = this.seriesInput().toLowerCase().trim();
    if (!query || this.selectedSeries()) return [];
    return this.allSeries().filter((s) => s.name.toLowerCase().startsWith(query));
  });

  selectSeries(series: SeriesModel) {
    this.selectedSeries.set(series);
    this.seriesInput.set(series.name);
    this.showSuggestions.set(false);
  }

  onSeriesInput(value: string) {
    this.seriesInput.set(value);
    this.selectedSeries.set(null);
    this.selectedVariant.set(null);
    this.productTypeInput.set('');
    this.selectedProductType.set(null);
  }

  onSeriesFieldEnter(event: Event) {
    event.preventDefault();
    if (this.suggestions().length === 1) {
      this.selectSeries(this.suggestions()[0]);
    }
  }

  onProductTypeFieldEnter(event: Event) {
  event.preventDefault();
  if (this.productTypeSuggestions().length === 1) {
    this.selectProductType(this.productTypeSuggestions()[0]);
  }
}
  // --- Fullständig seriedata (för riktiga variant-objekt) ---
  private selectedSeriesDetail = toSignal(
    toObservable(this.selectedSeries).pipe(
      switchMap((series) => {
        if (!series) return of(null);
        return this.seriesService.getBySlug(series.slug);
      }),
    ),
    { initialValue: null as SeriesModel | null },
  );

  // --- Variant: dropdown, autolåst om bara en finns ---
  selectedVariant = signal<SeriesVariant | null>(null);

  availableVariants = computed(() => this.selectedSeriesDetail()?.series_variant ?? []);

  isVariantLocked = computed(() => this.availableVariants().length === 1);

  onVariantChange(variantId: string) {
    const variant = this.availableVariants().find((v) => v.id === variantId) ?? null;
    this.selectedVariant.set(variant);
  }

  // --- Produkttyp: autocomplete, begränsad till vald serie ---
  private availableProductTypes = toSignal(
    toObservable(this.selectedSeries).pipe(
      switchMap((series) => {
        if (!series) return of([]);
        return this.seriesService.getProductTypes(series.slug);
      }),
    ),
    { initialValue: [] as ProductType[] },
  );

  productTypeInput = signal('');
  selectedProductType = signal<ProductType | null>(null);
  showProductTypeSuggestions = signal(false);

  productTypeSuggestions = computed(() => {
    const query = this.productTypeInput().toLowerCase().trim();
    if (!query || this.selectedProductType()) return [];
    return this.availableProductTypes().filter((pt) => pt.name.toLowerCase().includes(query));
  });

  onProductTypeInput(value: string) {
    this.productTypeInput.set(value);
    this.selectedProductType.set(null);
  }

  selectProductType(productType: ProductType) {
    this.selectedProductType.set(productType);
    this.productTypeInput.set(productType.name);
    this.showProductTypeSuggestions.set(false);
  }

  // --- Härlett namn ---
  generatedName = computed(() => {
    const series = this.selectedSeries();
    const variant = this.selectedVariant();
    const productType = this.selectedProductType();
    if (!series || !variant || !productType) return '';
    return `${series.name} ${variant.name} ${productType.name}`;
  });

  // --- Auto-lås variant om bara en finns ---
  constructor() {
    effect(() => {
      const variants = this.availableVariants();
      if (variants.length === 1) {
        this.selectedVariant.set(variants[0]);
      } else {
        this.selectedVariant.set(null);
      }
    });
  }

  // --- Signal Forms: enkla, validerbara fält ---
  productModel = signal<ProductFormModel>({
    price: 0,
    stock_quantity: 0,
    description: '',
    size_label: '',
    diameter_mm: '',
    height_mm: '',
    width_mm: '',
    length_mm: '',
    volume_ml: '',
    image_url: '',
    published_at: new Date().toISOString().split('T')[0],
    confirmPublishToday: false,
  });

  productForm = form(this.productModel, (f) => {
    validate(f.price, positiveNumber);
    validate(f.stock_quantity, positiveNumber);
    validate(f.diameter_mm, optionalPositiveNumber);
    validate(f.height_mm, optionalPositiveNumber);
    validate(f.width_mm, optionalPositiveNumber);
    validate(f.length_mm, optionalPositiveNumber);
    validate(f.volume_ml, optionalPositiveNumber);

    validateTree(f, (context) => {
      const data = context.value();
      const hasMeasurement =
        data.diameter_mm || data.height_mm || data.width_mm || data.length_mm || data.volume_ml;
      if (hasMeasurement && !data.size_label) {
        return {
          field: f.size_label,
          kind: 'sizeLabelRequired',
          message: 'Storleksetikett krävs när ett mått är angivet.',
        };
      }
      return undefined;
    });

    validateTree(f, (context) => {
      const data = context.value();
      const today = new Date().toISOString().split('T')[0];
      if (data.published_at === today && !data.confirmPublishToday) {
        return {
          field: f.confirmPublishToday,
          kind: 'confirmTodayRequired',
          message: 'Bekräfta att produkten verkligen ska publiceras IDAG, eller ändra datumet.',
        };
      }
      return undefined;
    });
  });

  // --- Submit: kombinerar kaskadväljare + Signal Forms-data ---
  onSubmit(event: Event) {
    event.preventDefault();

    const variant = this.selectedVariant();
    const productType = this.selectedProductType();
    const name = this.generatedName();
    const data = this.productModel();

    if (!variant || !productType || !name || this.productForm().invalid()) {
      return;
    }

    const input: CreateProductInput = {
      series_variant_id: variant.id,
      series_product_type_id: productType.id,
      name,
      price: data.price,
      stock_quantity: data.stock_quantity,
    };
    
    if (data.description) input.description = data.description;
    if (data.size_label) input.size_label = data.size_label;
    if (data.diameter_mm) input.diameter_mm = +data.diameter_mm;
    if (data.height_mm) input.height_mm = +data.height_mm;
    if (data.width_mm) input.width_mm = +data.width_mm;
    if (data.length_mm) input.length_mm = +data.length_mm;
    if (data.volume_ml) input.volume_ml = +data.volume_ml;
    if (data.image_url) input.image_url = data.image_url;
    if (data.published_at) input.published_at = data.published_at;

    this.productService.createProduct(input).subscribe({
      next: () => {
        alert('Produkten sparades!');
        this.router.navigate(['/admin/products']);
      },
      error: (err) => {
        console.error('Kunde inte spara produkten:', err);
        alert('Något gick fel: ' + (err.error?.error ?? 'okänt fel'));
      },
    });
  }
}
