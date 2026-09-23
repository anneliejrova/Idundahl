export interface BasketItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string | null;
  shapeSlug: string | null;
}