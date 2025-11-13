import { apiGet } from "./client";
import type { Product } from "../Storage/demoData"; // або звідки в тебе цей тип

export const getProducts = () => apiGet<Product[]>("/products");
export const getProduct  = (slug: string) => apiGet<Product>(`/products/${slug}`);