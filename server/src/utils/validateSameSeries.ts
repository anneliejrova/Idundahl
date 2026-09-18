import { supabase } from "../config/supabaseClient.js";


export async function validateSameSeries(
  seriesVariantId: string,
  seriesProductTypeId: string,
): Promise<void> {
  const { data: variant, error: variantError } = await supabase
    .from("series_variant")
    .select("series_id")
    .eq("id", seriesVariantId)
    .maybeSingle();

  if (variantError) {
    throw variantError;
  }

  if (!variant) {
    throw new Error("Vald variant hittades inte.");
  }

  const { data: productType, error: productTypeError } = await supabase
    .from("series_product_type")
    .select("series_id")
    .eq("id", seriesProductTypeId)
    .maybeSingle();

  if (productTypeError) {
    throw productTypeError;
  }

  if (!productType) {
    throw new Error("Vald produkttyp hittades inte.");
  }

  if (variant.series_id !== productType.series_id) {
    throw new Error("Variant och produkttyp tillhör olika serier.");
  }
}