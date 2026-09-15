import { Router } from "express";
import { supabase } from "../config/supabaseClient.js";
import type { SeriesVariant } from "../types/series.types.js";

export const seriesRouter = Router();

seriesRouter.get("/", async (req, res, next) => {
  const { data, error } = await supabase
    .from("series")
    .select(
      `
    id,
    name,
    slug,
    designer:credit!series_designer_id_fkey ( id, name),
    collaborator:credit!series_collaborator_id_fkey ( id, name),
    series_variant!inner ( image_url )
  `,
    )
    .eq("series_variant.is_main", true);

  if (error) {
    return next(error);
  }

  res.json(data);
});

seriesRouter.get("/:slug", async (req, res, next) => {
  const { slug } = req.params;

  const { data, error } = await supabase
    .from("series")
    .select(
      `
    id,
    name,
    slug,
    description,
    designer:credit!series_designer_id_fkey ( id, name),
    collaborator:credit!series_collaborator_id_fkey ( id, name),
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
    .maybeSingle();

  if (error) {
    return next(error);
  }

  if (!data) {
    return res.status(404).json({ error: "Serien hittades inte." });
  }

  const mainVariant = data.series_variant.find((v: SeriesVariant) => v.is_main);
  
  if (!mainVariant) {
    return res.status(500).json({ error: "Serien saknar en huvudvariant." });
  }

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
    .eq("series_id", series.id)
    .maybeSingle();

  if (variantError) {
    return next(variantError);
  }

  if (!variant) {
    return res.status(404).json({ error: "Variant hittades inte." });
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
