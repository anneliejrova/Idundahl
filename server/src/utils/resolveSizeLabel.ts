import type { CreateProductInput } from "../types/product.types.js";

export function resolveSizeLabel(product: CreateProductInput): string {
  const hasMeasurement =
    product.diameter_mm ||
    product.height_mm ||
    product.width_mm ||
    product.length_mm ||
    product.volume_ml;

  if (hasMeasurement && !product.size_label) {
    throw new Error(
      "size_label krävs när mått är angivna – fyll i innan produkten sparas.",
    );
  }

  if (!hasMeasurement && !product.size_label) {
    return "Lagom";
  }

  return product.size_label!;
}