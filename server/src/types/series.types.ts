import type { Product } from "./product.types.js";

export interface SeriesVariant {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  is_main: boolean;
}

export interface Credit {
  id: string;
  name: string;
  type: "person" | "company";
  description: string;
}

export interface Series {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  designer: Pick<Credit, "id" | "name"> | null;
  collaborator: Pick<Credit, "id" | "name"> | null;
  series_variant: SeriesVariant[];
  mainVariantProducts: Product[];
}