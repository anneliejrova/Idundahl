export interface Product {
  id: string;
  series_variant_id: string;
  series_product_type_id: string;
  sku: string;
  ean: string | null;
  name: string;
  slug: string;
  description: string | null;
  size_label: string;
  diameter_mm: number | null;
  height_mm: number | null;
  width_mm: number | null;
  length_mm: number | null;
  volume_ml: number | null;
  price: number;
  currency: string;
  stock_quantity: number;
  published_at: string | null;
}

export interface ProductWithBadge extends Product {
  isNew: boolean;
}