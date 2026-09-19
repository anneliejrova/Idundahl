export interface Credit {
  id: string;
  name: string;
}

export interface SeriesVariant {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  is_main: boolean;
  isNew: boolean;
}

export interface Series {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  mood_image_url: string | null;
  designer: Credit | null;
  collaborator: Credit | null;
  series_variant: SeriesVariant[];
  mainVariantProducts: unknown[];
  isNew: boolean;
}