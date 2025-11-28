export class CreateProductDto {
  name: string;
  slug: string;
  basePrice: number;
  description?: string;
  imageUrl?: string;
  categoryName?: string;
  categoryId?: number;

  variants?: {
    sku: string;
    size: string;
    color: string;
    price?: number;
    stock?: number;
  }[];
}
