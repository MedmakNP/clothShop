import pants_r from '../clothPhoto/pants_red.png'
import hoodie_r from '../clothPhoto/hoodie _red.png'
import dress_g from '../clothPhoto/dress_gray.png'


export type Size = 'XS'|'S'|'M'|'L'|'XL';
export type VariantSize = { size: Size; sku: string; inStock: boolean;};
export type Variant = {
  colorId: string;        // 'olive'
  colorHex: string;       // '#7E8B6A'
  images?: string[];      // галерея саме для цього кольору (опціонально)
  price?: number;         // опціонально: оверрайд ціни для кольору
  sizes: VariantSize[];   // ← тут усі розміри з SKU/стоком
};

export type ProductVariant = {
  id: number;
  sku: string;
  size: string;
  color: string;
  productId: number;
};

export type ProductImage = {
  id: number;
  url: string;
  productId: number;
};

export type Product = {
  id: number;
  slug: string;
  name: string;
  basePrice: number;
  description?: string;
  category?: { name: string };
  images?: ProductImage[];
  variants?: ProductVariant[];
};

