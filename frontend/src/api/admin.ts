import { apiGet } from "./client";

export type InventoryRow = {
  id: number;
  sku: string;
  size: string;
  color: string;
  price?: number | null;
  stock: number;
  isActive: boolean;
  product: {
    id: number;
    name: string;
    slug: string;
    isActive: boolean;
  };
};

/** Склад (облік по варіантах) */
export const getInventory = () => apiGet<InventoryRow[]>("/admin/inventory");

/** Оновити залишок конкретного варіанту */
export const updateVariantStock = async (id: number, stock: number) => {
  const res = await fetch(`https://clothshop-backend.onrender.com/admin/variants/${id}/stock`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ stock }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Stock update failed: ${res.status}\n${text}`);
  }
  return (await res.json()) as InventoryRow;
};