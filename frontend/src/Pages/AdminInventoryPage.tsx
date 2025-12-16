import React, { useEffect, useMemo, useState } from "react";
import Header from "../Components/Header/header";
import HotBar from "../Components/HotBar/hotBar";
import Footer from "../Components/Footer/footer";

import { getInventory, updateVariantStock, type InventoryRow } from "../api/admin";

const input: React.CSSProperties = {
  width: "100%",
  padding: "6px 8px",
  borderRadius: 6,
  border: "1px solid #ddd",
  fontSize: 13,
  boxSizing: "border-box",
};

const th: React.CSSProperties = {
  textAlign: "left",
  padding: "10px 10px",
  borderBottom: "1px solid #eee",
  whiteSpace: "nowrap",
  background: "#faf7f2",
  fontSize: 13,
};

const td: React.CSSProperties = {
  padding: "10px 10px",
  borderBottom: "1px solid #f0f0f0",
  verticalAlign: "top",
  fontSize: 13,
};

const miniBtn: React.CSSProperties = {
  padding: "4px 10px",
  borderRadius: 8,
  border: "1px solid #ddd",
  background: "#fff",
  cursor: "pointer",
  fontSize: 12,
};

const miniBtnPrimary: React.CSSProperties = {
  ...miniBtn,
  border: "none",
  background: "#b86b31",
  color: "#fff",
  fontWeight: 600,
};

function clampStock(n: number) {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.floor(n));
}

function AdminInventoryPage() {
  const [rows, setRows] = useState<InventoryRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [q, setQ] = useState("");
  const [showInactiveProducts, setShowInactiveProducts] = useState(true);
  const [onlyLowStock, setOnlyLowStock] = useState(false);
  const [lowStockThreshold, setLowStockThreshold] = useState<number>(2);

  const reload = async () => {
    try {
      setLoading(true);
      setErr(null);
      const data = await getInventory();
      setRows(data);
    } catch (e: any) {
      console.error(e);
      setErr(e?.message ?? "Помилка завантаження складу");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void reload();
  }, []);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return rows
      .filter((r) => (showInactiveProducts ? true : r.product.isActive))
      .filter((r) => (onlyLowStock ? (r.stock ?? 0) <= lowStockThreshold : true))
      .filter((r) => {
        if (!qq) return true;
        return (
          r.sku.toLowerCase().includes(qq) ||
          r.product.name.toLowerCase().includes(qq) ||
          r.product.slug.toLowerCase().includes(qq) ||
          (r.size ?? "").toLowerCase().includes(qq) ||
          (r.color ?? "").toLowerCase().includes(qq)
        );
      });
  }, [rows, q, showInactiveProducts, onlyLowStock, lowStockThreshold]);

  const totalVariants = rows.length;
  const totalStock = useMemo(
    () => rows.reduce((sum, r) => sum + (r.stock ?? 0), 0),
    [rows]
  );

  const setStock = async (id: number, next: number) => {
    try {
      setLoading(true);
      setErr(null);
      const updated = await updateVariantStock(id, clampStock(next));
      setRows((prev) => prev.map((r) => (r.id === id ? updated : r)));
    } catch (e: any) {
      console.error(e);
      setErr(e?.message ?? "Помилка оновлення залишку");
    } finally {
      setLoading(false);
    }
  };

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
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <h1 style={{ fontSize: 26, marginBottom: 8 }}>📦 Облік складу</h1>
          <button type="button" style={miniBtnPrimary} onClick={reload} disabled={loading}>
            🔄 Оновити
          </button>
        </div>

        {loading && <div style={{ marginBottom: 8, color: "#b86b31" }}>Йде запит...</div>}
        {err && (
          <div
            style={{
              marginBottom: 12,
              color: "#b2351e",
              padding: "8px 10px",
              background: "#ffecec",
              borderRadius: 10,
              border: "1px solid #ffd0d0",
            }}
          >
            {err}
          </div>
        )}

        {/* Фільтри */}
        <section
          style={{
            padding: 14,
            borderRadius: 12,
            background: "#fff",
            border: "1px solid #eee",
            marginBottom: 14,
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 10 }}>
            <label>
              <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>Пошук (SKU / назва / slug / size / color)</div>
              <input value={q} onChange={(e) => setQ(e.target.value)} style={input} placeholder="Напр. BH-BLK або hoodie" />
            </label>

            <label style={{ display: "flex", gap: 8, alignItems: "center", paddingTop: 18 }}>
              <input
                type="checkbox"
                checked={showInactiveProducts}
                onChange={(e) => setShowInactiveProducts(e.target.checked)}
              />
              <span style={{ fontSize: 13 }}>Показувати неактивні товари</span>
            </label>

            <label style={{ display: "flex", gap: 8, alignItems: "center", paddingTop: 18 }}>
              <input type="checkbox" checked={onlyLowStock} onChange={(e) => setOnlyLowStock(e.target.checked)} />
              <span style={{ fontSize: 13 }}>Тільки “закінчується”</span>
            </label>

            <label>
              <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>Поріг “закінчується”</div>
              <input
                type="number"
                value={lowStockThreshold}
                onChange={(e) => setLowStockThreshold(Number(e.target.value))}
                style={input}
                min={0}
              />
            </label>
          </div>

          <div style={{ marginTop: 10, fontSize: 12, color: "#666" }}>
            Варіантів: <b>{totalVariants}</b> · Загальний залишок: <b>{totalStock}</b>
          </div>
        </section>

        {/* Таблиця */}
        <section style={{ overflowX: "auto", border: "1px solid #eee", borderRadius: 12, background: "#fff" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={th}>SKU</th>
                <th style={th}>Товар</th>
                <th style={th}>Колір</th>
                <th style={th}>Розмір</th>
                <th style={th}>Stock</th>
                <th style={th}>Дії</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id}>
                  <td style={td}>
                    <div style={{ fontFamily: "monospace" }}>{r.sku}</div>
                    <div style={{ fontSize: 11, color: "#888" }}>variantId: {r.id}</div>
                  </td>

                  <td style={td}>
                    <div style={{ fontWeight: 700 }}>{r.product.name}</div>
                    <div style={{ fontSize: 12, color: "#777" }}>{r.product.slug}</div>
                    {!r.product.isActive && (
                      <div style={{ fontSize: 11, color: "#b2351e" }}>Товар неактивний</div>
                    )}
                  </td>

                  <td style={td}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span
                        style={{
                          width: 14,
                          height: 14,
                          borderRadius: 4,
                          background: r.color,
                          border: "1px solid #ddd",
                        }}
                      />
                      <span style={{ fontFamily: "monospace", fontSize: 12 }}>{r.color}</span>
                    </div>
                  </td>

                  <td style={td}>{r.size}</td>

                  <td style={td}>
                    <b>{r.stock ?? 0}</b>
                  </td>

                  <td style={td}>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <button type="button" style={miniBtn} onClick={() => setStock(r.id, (r.stock ?? 0) - 1)}>
                        −1
                      </button>
                      <button type="button" style={miniBtn} onClick={() => setStock(r.id, (r.stock ?? 0) + 1)}>
                        +1
                      </button>
                      <button
                        type="button"
                        style={miniBtn}
                        onClick={() => {
                          const v = prompt("Встановити stock (число):", String(r.stock ?? 0));
                          if (v == null) return;
                          const n = Number(v);
                          if (!Number.isFinite(n)) return alert("Введи число");
                          void setStock(r.id, n);
                        }}
                      >
                        Set
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td style={{ ...td, padding: 14 }} colSpan={6}>
                    Нічого не знайдено.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default AdminInventoryPage;