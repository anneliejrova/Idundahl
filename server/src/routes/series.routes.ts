import { Router } from "express";
import { supabase } from "../config/supabaseClient.js";
import type { SeriesVariant } from "../types/series.types.js";
import { isNew } from "../utils/isNew.js";
import type { SeriesListRow, SeriesQueryResult } from "../types/series.types.js";

export const seriesRouter = Router();

// Get all series with their main variant

seriesRouter.get("/", async (req, res, next) => {
  const { category } = req.query;

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  let seriesQuery = supabase
    .from("series")
    .select(
      `
      id,
      name,
      slug,
      description,
      mood_image_url,
      shape:shape_id ( slug ),
      designer:credit!series_designer_id_fkey ( id, name ),
      collaborator:credit!series_collaborator_id_fkey ( id, name ),
      series_variant!inner ( image_url )
    `,
    )
    .eq("series_variant.is_main", true) as unknown as SeriesQueryResult;

  if (typeof category === "string") {
    seriesQuery = supabase
      .from("series")
      .select(
        `
        id,
        name,
        slug,
        description,
        mood_image_url,
        shape:shape_id ( slug ),
        designer:credit!series_designer_id_fkey ( id, name ),
        collaborator:credit!series_collaborator_id_fkey ( id, name ),
        series_variant!inner ( image_url ),
        series_category!inner ( category!inner ( slug ) )
      `,
      )
      .eq("series_variant.is_main", true)
      .eq("series_category.category.slug", category) as unknown as SeriesQueryResult;
  }

  const [seriesResult, recentProductsResult] = await Promise.all([
    seriesQuery,
    supabase
      .from("product")
      .select("series_variant:series_variant_id ( series_id )")
      .gte("published_at", sevenDaysAgo.toISOString()),
  ]);

  if (seriesResult.error) {
    return next(seriesResult.error);
  }
  if (recentProductsResult.error) {
    return next(recentProductsResult.error);
  }

  const seriesWithNewProducts = new Set(
    recentProductsResult.data.map((p: any) => p.series_variant.series_id),
  );

  const seriesWithBadge = seriesResult.data.map((s) => ({
    ...s,
    isNew: seriesWithNewProducts.has(s.id),
  }));

  res.json(seriesWithBadge);
});

// Get a specific series by slug, including its main variant and products

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

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const variantIds = data.series_variant.map((v: SeriesVariant) => v.id);

  const [recentProductsResult, productsResult] = await Promise.all([
    supabase
      .from("product")
      .select("series_variant_id")
      .in("series_variant_id", variantIds)
      .gte("published_at", sevenDaysAgo.toISOString()),
    supabase
      .from("product")
      .select("*")
      .eq("series_variant_id", mainVariant.id),
  ]);

  if (recentProductsResult.error) {
    return next(recentProductsResult.error);
  }
  if (productsResult.error) {
    return next(productsResult.error);
  }

  const variantsWithNew = new Set(
    recentProductsResult.data.map((p: any) => p.series_variant_id),
  );

  const seriesVariantWithBadge = data.series_variant.map(
    (v: SeriesVariant) => ({
      ...v,
      isNew: variantsWithNew.has(v.id),
    }),
  );

  const mainVariantProducts = productsResult.data.map((p) => ({
    ...p,
    isNew: isNew(p.published_at),
  }));

  res.json({
    ...data,
    series_variant: seriesVariantWithBadge,
    mainVariantProducts,
  });
});

// Get product types for a specific series by series slug
seriesRouter.get("/:slug/product-types", async (req, res, next) => {
  const { slug } = req.params;

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

  const { data, error } = await supabase
    .from("series_product_type")
    .select("product_type:product_type_id ( id, name, slug )")
    .eq("series_id", series.id);

  if (error) {
    return next(error);
  }

  const productTypes = data.map((row: any) => row.product_type);

  res.json(productTypes);
});

// Get products for a specific series variant by series slug and variant slug

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

  const productsWithBadge = products.map((p) => ({
    ...p,
    isNew: isNew(p.published_at),
  }));

  res.json(productsWithBadge);
});