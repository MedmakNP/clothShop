// src/api/products.ts


import { apiGet, apiPost, apiPut, apiDelete } from "./client";
import type { Product as ApiProduct } from "../Storage/demoData";
import type { Product } from "../Storage/demoData"; // твій тип із Storage

export type { ApiProduct }; // щоб зручно було далі імпортувати



export const getProducts = () => apiGet<Product[]>("/products");
export const getProduct = (slug: string) =>
  apiGet<Product>(`/products/${slug}`);

// ↓↓↓ нові методи для адмінки ↓↓↓

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
}) => apiPost<Product>("/products", payload);

/** Оновити товар */
export const updateProduct = (id: number, payload: Partial<Product>) =>
  apiPut<Product>(`/products/${id}`, payload);

/** Видалити товар */
export const deleteProductApi = (id: number) =>
  apiDelete(`/products/${id}`);