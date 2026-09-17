import { Router } from "express";
import { supabase } from "../config/supabaseClient.js";
import { isNew } from "../utils/isNew.js";
import type { ProductDetail } from "../types/product.types.js";

export const productRouter = Router();

// Get 8 featured products
productRouter.get("/featured", async (req, res, next) => {
  const { data, error } = await supabase
    .from("product")
    .select("*, product_image ( image_url, is_main )")
    .in("slug", [
      "geometria-white-mugg",
      "geometria-grey-pastaskal",
      "bladens-rike-standard-frukostskal",
      "lovika-white-mugg",
      "lovika-brown-mugg",
      "busfro-standard-2-handtags-mugg",
      "kurbits-standard-mattallrik",
      "xevrine-standard-frukostskal",
    ]);

  if (error) {
    return next(error);
  }

  const productsWithBadge = data.map((p) => ({
    ...p,
    isNew: isNew(p.published_at),
  }));

  res.json(productsWithBadge);
});

// Get all products, optionally filtered by series slug
productRouter.get("/", async (req, res, next) => {
  const { series } = req.query;

  let query = supabase
    .from("product")
    .select(
      `
        id,
        name,
        sku,
        price,
        series_variant:series_variant_id!inner (
          name,
          series:series_id!inner ( id, name, slug )
        )
      `,
    )
    .order("series(name)", { ascending: true })
    .order("name", { ascending: true });

  if (typeof series === "string") {
    query = query.eq("series_variant.series.slug", series);
  }

  const { data, error } = await query;

  if (error) {
    return next(error);
  }

  res.json(data);
});


// Search for products by name
productRouter.get("/search", async (req, res, next) => {
  const { q } = req.query;

  if (typeof q !== "string" || q.length < 2) {
    return res
      .status(400)
      .json({ error: "Sökterm måste vara minst 2 tecken." });
  }

  const { data, error } = await supabase
    .from("product")
    .select("*, product_image ( image_url, is_main )")
    .ilike("name", `%${q}%`)
    .limit(50);

  if (error) {
    return next(error);
  }

  const productsWithBadge = data.map((p) => ({
    ...p,
    isNew: isNew(p.published_at),
  }));

  res.json({ count: productsWithBadge.length, results: productsWithBadge });
});


// Get a specific product by slug, including its series variant and product type
productRouter.get("/:slug", async (req, res, next) => {
  const { slug } = req.params;

  const { data, error } = await supabase
    .from("product")
    .select(
      `
        id,
        series_variant:series_variant_id!inner 
            ( id, name, slug, image_url, is_main ),
        series_product_type:series_product_type_id!inner 
            (id, product_type:product_type_id!inner ( id, name, slug )),
        product_image ( id, image_url, alt_text, is_main ),
        sku,
        ean,
        name,
        slug,
        description,
        size_label,
        diameter_mm,
        height_mm,
        width_mm,
        length_mm,
        volume_ml,
        price,
        currency,
        stock_quantity,
        published_at
    `,
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    return next(error);
  }

  if (!data) {
    return res.status(404).json({ error: "Produkten hittades inte." });
  }

  const { data: similarProducts, error: similarError } = await supabase
    .from("product")
    .select(
      "id, name, slug, price, published_at, product_image ( image_url, is_main )",
    )
    .eq("series_variant_id", (data.series_variant as any).id)
    .neq("id", data.id)
    .limit(5);

  if (similarError) {
    return next(similarError);
  }

  const similarProductsWithBadge = similarProducts.map((p) => ({
    ...p,
    isNew: isNew(p.published_at),
  }));

  const productWithBadge = {
    ...data,
    isNew: isNew(data.published_at),
    similarProducts: similarProductsWithBadge,
  } as unknown as ProductDetail;

  res.json(productWithBadge);
});



