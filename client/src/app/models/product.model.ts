import type { SeriesVariant } from './series.model';

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

export interface ProductType {
  id: string;
  name: string;
  slug: string;
}

export interface Shape {
  slug: string;
}

export interface ProductTypeWithShape extends ProductType {
  shape: Shape | null;
}

export interface SeriesProductType {
  id: string;
  product_type: ProductType;
}

export interface SeriesProductTypeWithShape {
  id: string;
  product_type: ProductTypeWithShape;
}

export interface SeriesProductTypeShapeOnly {
  product_type: { shape: Shape | null };
}

export interface ProductImage {
  id: string;
  image_url: string;
  alt_text: string | null;
  is_main: boolean;
}

export interface SimilarProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  published_at: string | null;
  isNew: boolean;
  product_image: Pick<ProductImage, "image_url" | "is_main">[];
  series_product_type: SeriesProductTypeShapeOnly;
}

export interface ProductDetail {
  id: string;
  series_variant: SeriesVariant;
  series_product_type: SeriesProductTypeWithShape;
  product_image: ProductImage[];
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
  isNew: boolean;
  similarProducts: SimilarProduct[];
}

export interface CreateProductInput {
  series_variant_id: string;
  series_product_type_id: string;
  name: string;
  price: number;
  stock_quantity: number;
  size_label?: string;
  diameter_mm?: number;
  height_mm?: number;
  width_mm?: number;
  length_mm?: number;
  volume_ml?: number;
  ean?: string;
  description?: string;
  image_url?: string;
}

export interface ProductCardData extends ProductWithBadge {
  product_image: Pick<ProductImage, 'image_url' | 'is_main'>[];
  series_product_type: SeriesProductTypeShapeOnly;
}