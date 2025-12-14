// src/api/products.ts

import { apiGet, apiPost, apiPut, apiDelete } from "./client";

/**
 * Точний (або майже точний) тип того, що повертає бекенд /products і /products/:slug
 * Підлаштовано під Prisma include: { images: true, variants: true, category: true }
 */
export type ApiProductImage = {
  id: number;
  url: string;
  sortOrder: number;
  productId: number;
  variantId: number | null; // 👈 додай
};

export type ApiProductVariant = {
  id: number;
  productId: number;
  sku: string;
  size: string;   // будь-який текст: "M", "108", "42-44"
  color: string;  // "#000000" або "black"
  price: number | null;
  stock: number;
  isActive: boolean;
};

export type ApiProduct = {
  id: number;
  slug: string;
  name: string;
  basePrice: number;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  categoryId: number | null;
  images: ApiProductImage[];
  variants: ApiProductVariant[];
  // category теж є, але нам поки не обовʼязково його типізувати
};

export const getProducts = () => apiGet<ApiProduct[]>("/products");

export const getProduct = (slug: string) =>
  apiGet<ApiProduct>(`/products/${slug}`);

/** Створити новий товар */
export const createProduct = (payload: {
  name: string;
  slug: string;
  basePrice: number;
  description?: string;
  imageUrl?: string;
  categoryName?: string;
  variants?: {
    sku: string;
    size: string;
    color: string;
    price?: number;
    stock?: number;
  }[];
}) => apiPost<ApiProduct>("/products", payload);

/** Оновити товар */
export const updateProduct = (id: number, payload: Partial<ApiProduct>) =>
  apiPut<ApiProduct>(`/products/${id}`, payload);

export const addProductImage = (
  productId: number,
  payload: { url: string; sortOrder?: number; variantId?: number | null }
) => apiPost(`/products/${productId}/images`, payload);

/** Видалити товар */
export const deleteProductApi = (id: number) =>
  apiDelete(`/products/${id}`);
