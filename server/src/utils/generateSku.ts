interface SkuParts {
  seriesSkuCode: string;
  productTypeSkuCode: string;
  variantSkuCode: string;
  sizeLabel: string;
}

export function generateSku({
  seriesSkuCode,
  productTypeSkuCode,
  variantSkuCode,
  sizeLabel,
}: SkuParts): string {
  const sizePart = sizeLabel.match(/\d+/)?.[0] ?? "";

  return [seriesSkuCode, productTypeSkuCode, variantSkuCode, sizePart]
    .filter(Boolean)
    .join("-");
}