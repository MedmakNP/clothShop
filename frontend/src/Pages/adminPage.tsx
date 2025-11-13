import React, { useMemo, useState } from "react";
import Header from "../Components/Header/header";
import HotBar from "../Components/HotBar/hotBar";
import Footer from "../Components/Footer/footer";
import {
  demoProducts as initialDemoProducts,
  Product,
  Variant,
  VariantSize,
  Size,
} from "../Storage/demoData";

const sizesList: Size[] = ["XS", "S", "M", "L", "XL"];

type VariantDraft = {
  colorId: string;
  colorHex: string;
  sizes: VariantSize[];
};

function AdminPage() {
  const [products, setProducts] = useState<Product[]>(initialDemoProducts);

  // Поля форми нового продукту
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [price, setPrice] = useState<string>("");
  const [imageUrl, setImageUrl] = useState("");
  const [tagsInput, setTagsInput] = useState("");

  // Чернетки варіантів (кольори + розміри)
  const [variantDrafts, setVariantDrafts] = useState<VariantDraft[]>([]);

  // Чернетка для одного розміру всередині активного варіанту
  const [currentVariantIndex, setCurrentVariantIndex] = useState<number | null>(
    null
  );
  const [sizeValue, setSizeValue] = useState<Size>("M");
  const [skuValue, setSkuValue] = useState("");
  const [inStockValue, setInStockValue] = useState(true);

  // ===== ДОДАЄМО ВАРІАНТ =====
  const addVariant = () => {
    if (!slug.trim()) {
      alert("Спочатку заповни slug (для генерації sku).");
      return;
    }
    const colorId = window.prompt("ID кольору (наприклад, red, gray):", "");
    if (!colorId) return;

    const colorHex =
      window.prompt("Колір HEX (наприклад, #ff0000):", "#ffffff") || "#ffffff";

    setVariantDrafts((prev) => [
      ...prev,
      { colorId, colorHex, sizes: [] },
    ]);
    setCurrentVariantIndex(variantDrafts.length); // робимо новий активним
  };

  // ===== ДОДАЄМО РОЗМІР В АКТИВНИЙ ВАРІАНТ =====
  const addSizeToCurrentVariant = () => {
    if (currentVariantIndex == null) {
      alert("Спочатку створи та обери варіант (колір).");
      return;
    }
    if (!skuValue.trim()) {
      alert("Введи SKU для розміру.");
      return;
    }

    setVariantDrafts((prev) =>
      prev.map((v, i) =>
        i === currentVariantIndex
          ? {
              ...v,
              sizes: [
                ...v.sizes,
                { size: sizeValue, sku: skuValue.trim(), inStock: inStockValue },
              ],
            }
          : v
      )
    );

    // очистити локальні поля
    setSkuValue("");
    setInStockValue(true);
  };

  const removeVariant = (index: number) => {
    setVariantDrafts((prev) => prev.filter((_, i) => i !== index));
    if (currentVariantIndex === index) {
      setCurrentVariantIndex(null);
    }
  };

  const removeSize = (variantIndex: number, sku: string) => {
    setVariantDrafts((prev) =>
      prev.map((v, i) =>
        i === variantIndex
          ? { ...v, sizes: v.sizes.filter((s) => s.sku !== sku) }
          : v
      )
    );
  };

  // ===== ДОДАЄМО ПРОДУКТ =====
  const addProduct = () => {
    if (!title.trim() || !slug.trim() || !price.trim()) {
      alert("Title, slug і price обов'язкові.");
      return;
    }
    if (products.some((p) => p.slug === slug.trim())) {
      alert("Такий slug вже існує.");
      return;
    }

    const numPrice = Number(price);
    if (Number.isNaN(numPrice) || numPrice <= 0) {
      alert("Price має бути числом > 0.");
      return;
    }

    // якщо немає жодного варіанту — зробимо дефолтний,
    // щоб структура завжди була валідною
    let variants: Variant[];
    if (variantDrafts.length === 0) {
      const autoSku = slug.toUpperCase() + "-M";
      variants = [
        {
          colorId: "default",
          colorHex: "#ffffff",
          sizes: [{ size: "M", sku: autoSku, inStock: true }],
        },
      ];
    } else {
      variants = variantDrafts.map((v, idx) => {
        if (v.sizes.length === 0) {
          const autoSku = `${slug.toUpperCase()}-${v.colorId.toUpperCase()}-M`;
          return {
            ...v,
            sizes: [{ size: "M", sku: autoSku, inStock: true }],
          };
        }
        return v;
      });
    }

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const images: string[] = imageUrl.trim()
      ? [imageUrl.trim()]
      : [];

    const newProduct: Product = {
      id: Date.now().toString(),
      slug: slug.trim(),
      title: title.trim(),
      price: numPrice,
      images,
      tags: tags.length ? tags : undefined,
      variants,
    };

    setProducts((prev) => [...prev, newProduct]);

    // скидаємо форму
    setTitle("");
    setSlug("");
    setPrice("");
    setImageUrl("");
    setTagsInput("");
    setVariantDrafts([]);
    setCurrentVariantIndex(null);
    setSkuValue("");
    setInStockValue(true);
  };

  // ===== ВИДАЛЕННЯ ПРОДУКТУ =====
  const deleteProduct = (slugToDelete: string) => {
    if (!window.confirm(`Видалити товар ${slugToDelete}?`)) return;
    setProducts((prev) => prev.filter((p) => p.slug !== slugToDelete));
  };

  // ===== JSON ДЛЯ КОПІЮВАННЯ =====
  const exportJson = useMemo(
    () => JSON.stringify(products, null, 2),
    [products]
  );

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(exportJson);
      alert("Скопійовано! Встав у demoData.ts замість demoProducts.");
    } catch (e) {
      alert("Не вдалося скопіювати. Спробуй вручну виділити та скопіювати.");
    }
  };

  // ===== UI =====
  return (
    <>
      <Header />
      <HotBar />
      <main
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "32px 16px 48px",
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        }}
      >
        <h1 style={{ fontSize: 26, marginBottom: 16 }}>Адмінка (локальний JSON)</h1>
        <p style={{ marginBottom: 24, color: "#555" }}>
          Тут ти додаєш товари. Внизу зʼявляється JSON. Просто копіюєш його в{" "}
          <code>demoData.ts</code> замість старого <code>demoProducts</code>.
          Ніяких серверів, все тільки локально.
        </p>

        {/* ФОРМА ПРОДУКТУ */}
        <section
          style={{
            padding: 16,
            borderRadius: 12,
            background: "#faf7f2",
            marginBottom: 24,
            boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
          }}
        >
          <h2 style={{ fontSize: 18, marginBottom: 12 }}>Новий товар</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
              gap: 12,
              marginBottom: 12,
            }}
          >
            <label>
              <div>Title</div>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Спортивна худі"
                style={inputStyle}
              />
            </label>

            <label>
              <div>Slug</div>
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="hoodie"
                style={inputStyle}
              />
            </label>

            <label>
              <div>Price</div>
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="999"
                style={inputStyle}
              />
            </label>

            <label>
              <div>Головне зображення (URL або імпортний шлях)</div>
              <input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="/clothPhoto/hoodie_red.png"
                style={inputStyle}
              />
            </label>

            <label>
              <div>Tags (через кому)</div>
              <input
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="New,-20%"
                style={inputStyle}
              />
            </label>
          </div>

          {/* ВАРІАНТИ */}
          <div style={{ marginBottom: 8, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button type="button" onClick={addVariant} style={btnSoft}>
              + Додати варіант (колір)
            </button>
          </div>

          {variantDrafts.length > 0 && (
            <div
              style={{
                display: "flex",
                gap: 16,
                alignItems: "flex-start",
                flexWrap: "wrap",
              }}
            >
              {/* Список варіантів */}
              <div style={{ minWidth: 220 }}>
                <div style={{ marginBottom: 4, fontWeight: 600 }}>Варіанти</div>
                {variantDrafts.map((v, i) => (
                  <div
                    key={i}
                    style={{
                      padding: 8,
                      marginBottom: 6,
                      borderRadius: 8,
                      border:
                        i === currentVariantIndex
                          ? "2px solid #b86b31"
                          : "1px solid #ddd",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 8,
                      background: "#fff",
                    }}
                  >
                    <div
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: 4,
                        background: v.colorHex,
                        border: "1px solid #ccc",
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div>{v.colorId}</div>
                      <div
                        style={{ fontSize: 11, color: "#999" }}
                      >{`${v.sizes.length} розмір(и)`}</div>
                    </div>
                    <button
                      type="button"
                      style={miniBtn}
                      onClick={() => setCurrentVariantIndex(i)}
                    >
                      edit
                    </button>
                    <button
                      type="button"
                      style={miniBtnDanger}
                      onClick={() => removeVariant(i)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              {/* Додавання розміру до активного варіанту */}
              {currentVariantIndex != null && (
                <div style={{ flex: 1, minWidth: 260 }}>
                  <div style={{ marginBottom: 4, fontWeight: 600 }}>
                    Розміри для варіанту #{currentVariantIndex + 1}
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
                    <select
                      value={sizeValue}
                      onChange={(e) => setSizeValue(e.target.value as Size)}
                      style={inputStyle}
                    >
                      {sizesList.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <input
                      value={skuValue}
                      onChange={(e) => setSkuValue(e.target.value)}
                      placeholder="HD-R-S"
                      style={inputStyle}
                    />
                    <label style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <input
                        type="checkbox"
                        checked={inStockValue}
                        onChange={(e) => setInStockValue(e.target.checked)}
                      />
                      В наявності
                    </label>
                    <button
                      type="button"
                      onClick={addSizeToCurrentVariant}
                      style={btnSoft}
                    >
                      + Додати розмір
                    </button>
                  </div>

                  {/* Показати розміри */}
                  <div style={{ fontSize: 13 }}>
                    {variantDrafts[currentVariantIndex].sizes.map((s) => (
                      <div
                        key={s.sku}
                        style={{
                          display: "inline-flex",
                          gap: 6,
                          alignItems: "center",
                          padding: "4px 8px",
                          borderRadius: 999,
                          border: "1px solid #ddd",
                          marginRight: 6,
                          marginBottom: 6,
                        }}
                      >
                        <span>{s.size}</span>
                        <span style={{ color: "#888" }}>{s.sku}</span>
                        {!s.inStock && (
                          <span style={{ color: "#c00", fontSize: 10 }}>out</span>
                        )}
                        <button
                          type="button"
                          style={miniBtn}
                          onClick={() =>
                            removeSize(currentVariantIndex, s.sku)
                          }
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div style={{ marginTop: 12 }}>
            <button type="button" onClick={addProduct} style={btnPrimary}>
              Зберегти товар у локальний список
            </button>
          </div>
        </section>

        {/* СПИСОК ТОВАРІВ */}
        <section
          style={{
            marginBottom: 24,
            padding: 16,
            borderRadius: 12,
            background: "#f5f5f5",
          }}
        >
          <h2 style={{ fontSize: 18, marginBottom: 8 }}>Поточні товари</h2>
          {products.length === 0 && <div>Ще немає товарів.</div>}
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
                <strong>{p.title}</strong>{" "}
                <span style={{ color: "#999" }}>({p.slug})</span>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ color: "#666" }}>
                  {p.variants.length} вар. / {p.variants
                    .map((v) => v.sizes.length)
                    .reduce((a, b) => a + b, 0)}{" "}
                  SKU
                </span>
                <button
                  type="button"
                  style={miniBtnDanger}
                  onClick={() => deleteProduct(p.slug)}
                >
                  Видалити
                </button>
              </div>
            </div>
          ))}
        </section>

        {/* ЕКСПОРТ JSON */}
        <section>
          <h2 style={{ fontSize: 18, marginBottom: 8 }}>Export JSON</h2>
          <p style={{ fontSize: 13, color: "#666", marginBottom: 8 }}>
            Скопіюй це і встав у <code>demoData.ts</code> замість
            <code>demoProducts</code>.
          </p>
          <div style={{ marginBottom: 8 }}>
            <button type="button" onClick={copyToClipboard} style={btnSoft}>
              Скопіювати в буфер
            </button>
          </div>
          <textarea
            value={exportJson}
            readOnly
            style={{
              width: "100%",
              minHeight: 260,
              fontFamily: "monospace",
              fontSize: 12,
              padding: 10,
              borderRadius: 8,
              border: "1px solid #ddd",
              background: "#fafafa",
              whiteSpace: "pre",
            }}
          />
        </section>
      </main>
      <Footer />
    </>
  );
}

/* ===== ТРОХИ СТИЛІВ ===== */

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "6px 8px",
  borderRadius: 6,
  border: "1px solid #d0c6b8",
  fontSize: 13,
  boxSizing: "border-box",
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

export default AdminPage;
