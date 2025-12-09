// src/Pages/adminDbPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import Header from "../Components/Header/header";
import HotBar from "../Components/HotBar/hotBar";
import Footer from "../Components/Footer/footer";

import type { ApiProduct } from "../api/products";
import {
  getProducts,
  createProduct,
  deleteProductApi,
} from "../api/products";
import { apiUploadImage } from "../api/client";

type NewVariant = {
  sku: string;
  size: string;
  color: string;
  price?: number;
  stock?: number;
};

function AdminDbPage() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // поля форми нового товару
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [basePrice, setBasePrice] = useState<string>("");
  const [description, setDescription] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  // простий список варіантів
  const [variants, setVariants] = useState<NewVariant[]>([]);
  const [variantSize, setVariantSize] = useState("M");
  const [variantColor, setVariantColor] = useState("#000000");
  const [variantSku, setVariantSku] = useState("");
  const [variantPrice, setVariantPrice] = useState<string>("");
  const [variantStock, setVariantStock] = useState<string>("10");

  // ====== ЗАВАНТАЖЕННЯ СПИСКУ ТОВАРІВ З БЕКЕНДУ ======
  const reloadProducts = async () => {
    try {
      setLoading(true);
      setErr(null);
      const data = await getProducts();
      setProducts(data);
    } catch (e: any) {
      console.error(e);
      setErr(e?.message ?? "Помилка завантаження товарів");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void reloadProducts();
  }, []);

  // ====== ДОДАЄМО ВАРІАНТ (size/color/sku) ======
  const addVariant = () => {
    if (!variantSku.trim()) {
      alert("Введи SKU для варіанту");
      return;
    }
    setVariants((prev) => [
      ...prev,
      {
        sku: variantSku.trim(),
        size: variantSize,
        color: variantColor,
        price: variantPrice ? Number(variantPrice) : undefined,
        stock: variantStock ? Number(variantStock) : undefined,
      },
    ]);
    setVariantSku("");
    setVariantPrice("");
    setVariantStock("10");
  };

  const removeVariant = (sku: string) => {
    setVariants((prev) => prev.filter((v) => v.sku !== sku));
  };

  // ====== ЗАВАНТАЖЕННЯ КАРТИНКИ НА СЕРВЕР ======
  const handleUploadImage = async () => {
    if (!imageFile) {
      alert("Обери файл зображення");
      return;
    }
    try {
      setLoading(true);
      setErr(null);
      const { url } = await apiUploadImage(imageFile, "products");
      setImageUrl(url);
      alert("Зображення завантажене, url вставлено в поле.");
    } catch (e: any) {
      console.error(e);
      setErr(e?.message ?? "Помилка завантаження зображення");
    } finally {
      setLoading(false);
    }
  };

  // ====== СТВОРЕННЯ НОВОГО ТОВАРУ В БАЗІ ======
  const handleCreateProduct = async () => {
    if (!name.trim() || !slug.trim() || !basePrice.trim()) {
      alert("Name, slug і price обовʼязкові");
      return;
    }
    const priceNum = Number(basePrice);
    if (!Number.isFinite(priceNum) || priceNum <= 0) {
      alert("Price має бути додатнім числом");
      return;
    }

    try {
      setLoading(true);
      setErr(null);

      const payload = {
        name: name.trim(),
        slug: slug.trim(),
        basePrice: priceNum,
        description: description.trim() || undefined,
        imageUrl: imageUrl.trim() || undefined,
        categoryName: categoryName.trim() || undefined,
        variants: variants.length
          ? variants
          : [
              {
                sku: slug.toUpperCase() + "-M",
                size: "M",
                color: "black",
                stock: 10,
              },
            ],
      };

      const created = await createProduct(payload);
      setProducts((prev) => [...prev, created]);

      // скидаємо форму
      setName("");
      setSlug("");
      setBasePrice("");
      setDescription("");
      setCategoryName("");
      setImageUrl("");
      setImageFile(null);
      setVariants([]);
      alert("Товар створено в базі");
    } catch (e: any) {
      console.error(e);
      setErr(e?.message ?? "Помилка створення товару");
    } finally {
      setLoading(false);
    }
  };

  // ====== ВИДАЛЕННЯ ТОВАРУ ======
  const handleDeleteProduct = async (p: ApiProduct) => {
    if (!window.confirm(`Видалити товар "${p.name}"?`)) return;
    try {
      setLoading(true);
      setErr(null);
      await deleteProductApi(p.id);
      setProducts((prev) => prev.filter((x) => x.id !== p.id));
    } catch (e: any) {
      console.error(e);
      setErr(e?.message ?? "Помилка видалення товару");
    } finally {
      setLoading(false);
    }
  };

  // Для дебага — JSON
  const debugJson = useMemo(
    () => JSON.stringify(products, null, 2),
    [products]
  );

  // ====== UI ======
  return (
    <>
      <Header />
      <HotBar />
      <main
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "32px 16px 48px",
          fontFamily:
            "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        }}
      >
        <h1 style={{ fontSize: 26, marginBottom: 8 }}>
          Адмінка
        </h1>
        {loading && (
          <div style={{ marginBottom: 8, color: "#b86b31" }}>
            Зачекай, йде запит до сервера...
          </div>
        )}
        {err && (
          <div
            style={{
              marginBottom: 8,
              color: "#b2351e",
              padding: "6px 10px",
              background: "#ffecec",
              borderRadius: 8,
            }}
          >
            {err}
          </div>
        )}

        {/* ФОРМА НОВОГО ТОВАРУ */}
        <section
          style={{
            padding: 16,
            borderRadius: 12,
            background: "#faf7f2",
            marginBottom: 24,
            boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
          }}
        >
          <h2 style={{ fontSize: 20, marginBottom: 12 }}>Новий товар</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
              gap: 12,
              marginBottom: 12,
            }}
          >
            <label>
              <div>Назва (name)</div>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={input}
                placeholder="Black Hoodie"
              />
            </label>
            <label>
              <div>Slug</div>
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                style={input}
                placeholder="black-hoodie"
              />
            </label>
            <label>
              <div>Ціна (basePrice)</div>
              <input
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                style={input}
                placeholder="1200"
              />
            </label>
            <label>
              <div>Категорія (тільки назва)</div>
              <input
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                style={input}
                placeholder="Hoodies"
              />
            </label>
          </div>

          <label style={{ display: "block", marginBottom: 8 }}>
            <div>Опис</div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ ...input, minHeight: 60, resize: "vertical" }}
              placeholder="Тепла худі, 80% cotton"
            />
          </label>

          {/* ЗОБРАЖЕННЯ */}
          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              marginBottom: 12,
              alignItems: "center",
            }}
          >
            <div style={{ flex: 1, minWidth: 220 }}>
              <div>URL зображення (можна вручну або після upload)</div>
              <input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                style={input}
                placeholder="https://...supabase.co/storage/v1/object/public/products/..."
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setImageFile(e.target.files?.[0] ?? null)
                }
              />
              <button type="button" style={btnSoft} onClick={handleUploadImage}>
                Завантажити на сервер (Supabase)
              </button>
            </div>
          </div>

          {/* ВАРІАНТИ */}
          <div
            style={{
              margin: "12px 0 8px",
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            Варіанти (size/color/sku)
          </div>
          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <input
              value={variantSize}
              onChange={(e) => setVariantSize(e.target.value)}
              style={inputSmall}
              placeholder="Розмір (M, S, 108, 120...)"
            />
            <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
              <input
                type="color"
                value={variantColor}
                onChange={(e) => setVariantColor(e.target.value)}
                style={{
                  width: 36,
                  height: 32,
                  padding: 0,
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                }}
              />
              <input
                value={variantColor}
                onChange={(e) => setVariantColor(e.target.value)}
                style={inputSmall}
                placeholder="#000000"
              />
            </div>
            <input
              value={variantSku}
              onChange={(e) => setVariantSku(e.target.value)}
              style={inputSmall}
              placeholder="BH-BLACK-M"
            />
            <input
              value={variantPrice}
              onChange={(e) => setVariantPrice(e.target.value)}
              style={inputSmall}
              placeholder="(ціна.) 1200"
            />
            <input
              value={variantStock}
              onChange={(e) => setVariantStock(e.target.value)}
              style={inputSmall}
              placeholder="(кільк.) 10"
            />
            <button type="button" style={btnSoft} onClick={addVariant}>
              + Додати варіант
            </button>
          </div>
          {variants.length > 0 && (
            <div style={{ fontSize: 13, marginBottom: 12 }}>
              {variants.map((v) => (
                <span
                  key={v.sku}
                  style={{
                    display: "inline-flex",
                    gap: 6,
                    alignItems: "center",
                    padding: "4px 8px",
                    borderRadius: 999,
                    border: "1px solid #ddd",
                    marginRight: 6,
                    marginBottom: 6,
                    background: "#fff",
                  }}
                >
                  <span>
                    {v.size}/{v.color}
                  </span>
                  <span style={{ color: "#888" }}>{v.sku}</span>
                  {typeof v.stock === "number" && (
                    <span style={{ color: "#666", fontSize: 11 }}>
                      stock: {v.stock}
                    </span>
                  )}
                  <button
                    type="button"
                    style={miniBtn}
                    onClick={() => removeVariant(v.sku)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          <button
            type="button"
            style={btnPrimary}
            onClick={handleCreateProduct}
          >
            Створити товар в базі
          </button>
        </section>

        {/* СПИСОК ТОВАРІВ З БАЗИ */}
        <section
          style={{
            padding: 16,
            borderRadius: 12,
            background: "#f5f5f5",
            marginBottom: 24,
          }}
        >
          <h2 style={{ fontSize: 18, marginBottom: 8 }}>Товари в базі</h2>
          {products.length === 0 && <div>Поки немає товарів.</div>}
          {products.map((p) => (
            <div
              key={p.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "6px 0",
                borderBottom: "1px solid #e1e1e1",
                fontSize: 14,
              }}
            >
              <div>
                <strong>{p.name}</strong>{" "}
                <span style={{ color: "#999" }}>({p.slug})</span>
                {p.basePrice != null && (
                  <span style={{ marginLeft: 8, color: "#555" }}>
                    {p.basePrice} грн
                  </span>
                )}
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "#777" }}>
                  {p.variants?.length ?? 0} варіантів
                </span>
                <button
                  type="button"
                  style={miniBtnDanger}
                  onClick={() => handleDeleteProduct(p)}
                >
                  Видалити
                </button>
              </div>
            </div>
          ))}
        </section>

        {/* Опційно: дебаг JSON */}
        <section>
          <details>
            <summary style={{ cursor: "pointer" }}>
              Показати сирий JSON (для дебага)
            </summary>
            <textarea
              readOnly
              value={debugJson}
              style={{
                width: "100%",
                minHeight: 200,
                fontFamily: "monospace",
                fontSize: 12,
                padding: 10,
                borderRadius: 8,
                border: "1px solid #ddd",
                background: "#fafafa",
                marginTop: 8,
              }}
            />
          </details>
        </section>
      </main>
      <Footer />
    </>
  );
}

/* трохи стилів inline */

const input: React.CSSProperties = {
  width: "100%",
  padding: "6px 8px",
  borderRadius: 6,
  border: "1px solid #d0c6b8",
  fontSize: 13,
  boxSizing: "border-box",
};

const inputSmall: React.CSSProperties = {
  ...input,
  maxWidth: 130,
};

const btnSoft: React.CSSProperties = {
  padding: "6px 10px",
  borderRadius: 999,
  border: "1px solid #d0c6b8",
  background: "#fff",
  fontSize: 12,
  cursor: "pointer",
};

const btnPrimary: React.CSSProperties = {
  padding: "8px 16px",
  borderRadius: 999,
  border: "none",
  background: "#b86b31",
  color: "#fff",
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer",
};

const miniBtn: React.CSSProperties = {
  padding: "2px 6px",
  borderRadius: 6,
  border: "1px solid #ccc",
  background: "#fff",
  fontSize: 10,
  cursor: "pointer",
};

const miniBtnDanger: React.CSSProperties = {
  ...miniBtn,
  borderColor: "#e3967d",
  color: "#b2351e",
};

export default AdminDbPage;