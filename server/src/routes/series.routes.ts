import { Router } from "express";
import { supabase } from "../config/supabaseClient.js";

export const seriesRouter = Router();

seriesRouter.get("/:slug", async (req, res, next) => {
  const { slug } = req.params;

  const { data, error } = await supabase
    .from("series")
    .select(
      `
    *,
    series_variant (
      id,
      name,
      slug,
      image_url,
      is_main
    )
  `,
    )
    .eq("slug", slug)
    .single();

  if (error) {
    return next(error);
  }

  const mainVariant = data.series_variant.find((v: any) => v.is_main);

  const { data: products, error: productsError } = await supabase
    .from("product")
    .select("*")
    .eq("series_variant_id", mainVariant.id);

  if (productsError) {
    return next(productsError);
  }

  res.json({ ...data, mainVariantProducts: products });
});

seriesRouter.get("/:slug/:variantSlug", async (req, res, next) => {
  const { slug, variantSlug } = req.params;

  const { data: series, error: seriesError } = await supabase
    .from("series")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (seriesError) {
    return next(seriesError);
  }

  if (!series) {
  return res.status(404).json({ error: "Serien hittades inte." });
}

  const { data: variant, error: variantError } = await supabase
    .from("series_variant")
    .select("id, series_id")
    .eq("slug", variantSlug)
    .maybeSingle();

  if (variantError) {
    return next(variantError);
  }

  if (!variant) {
    return res.status(404).json({ error: "Variant hittades inte." });
  }

  if (variant.series_id !== series.id) {
    return res.status(404).json({ error: "Variant hör inte till angiven serie." });
  }

  const { data: products, error: productsError } = await supabase
    .from("product")
    .select("*")
    .eq("series_variant_id", variant.id);

  if (productsError) {
    return next(productsError);
  }

  res.json(products);
});