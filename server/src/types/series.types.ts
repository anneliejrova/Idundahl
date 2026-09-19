import type { ProductWithBadge } from "./product.types.js";
import type { Credit } from "./credit.types.js";

export interface SeriesVariant {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  is_main: boolean;
}

export interface SeriesVariantWithBadge extends SeriesVariant {
  isNew: boolean;
}

export interface Series {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  mood_image_url: string | null; 
  designer: Pick<Credit, "id" | "name"> | null;
  collaborator: Pick<Credit, "id" | "name"> | null;
  series_variant: SeriesVariantWithBadge[];
  mainVariantProducts: ProductWithBadge[];
}