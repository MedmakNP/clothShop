// src/Pages/product.tsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import Header from "../Components/Header/header";
import HotBar from "../Components/HotBar/hotBar";
import Footer from "../Components/Footer/footer";

import { getProduct, type ApiProduct } from "../api/products";
import ProductCard, {
  type Product as CardProduct,
} from "../Components/ProductCard/productCard";

// допоміжний тип — як у тебе в Storage/demoData
import type { ProductVariant } from "../Storage/demoData";

// Мапимо колір у HEX (поки що груба логіка, можна потім винести в конфіг)
function colorToHex(color: string | null | undefined): string {
  if (!color) return "#cccccc";
  switch (color.toLowerCase()) {
    case "black":
      return "#000000";
    case "white":
      return "#ffffff";
    case "red":
      return "#ff0000";
    case "blue":
      return "#0066ff";
    case "green":
      return "#2ecc71";
    default:
      return "#cccccc";
  }
}

// Маппер: ApiProduct -> CardProduct
function mapApiProductToCardProduct(p: ApiProduct): CardProduct {
  // зображення з бекенду
  const images = (p.images ?? []).map((img) => img.url);

  // групуємо варіанти по кольору
  const byColor = new Map<
    string,
    {
      colorId: string;
      colorHex: string;
      sizes: { size: any; sku: string; inStock: boolean; price?: number }[];
    }
  >();

  for (const v of p.variants ?? []) {
    const colorId = (v.color || "default").toLowerCase();
    if (!byColor.has(colorId)) {
      byColor.set(colorId, {
        colorId,
        colorHex: colorToHex(colorId),
        sizes: [],
      });
    }
    const bucket = byColor.get(colorId)!;
    bucket.sizes.push({
      size: v.size as any, // "S" | "M" | "L" ...
      sku: v.sku,
      inStock: true, // можна буде повʼязати зі stock, якщо додаси в тип
    });
  }

  return {
    id: String(p.id),
    slug: p.slug,
    title: p.name,
    price: p.basePrice,
    images,
    tags: undefined, // можна підтягнути з БД, якщо додаси
    variants: Array.from(byColor.values()),
    description: p.description,
  };
}

function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<CardProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setError("Немає slug у URL");
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    getProduct(slug)
      .then((apiProduct) => {
        if (cancelled) return;
        const mapped = mapApiProductToCardProduct(apiProduct);
        setProduct(mapped);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        if (cancelled) return;
        setError("Не вдалося завантажити товар");
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <>
        <Header />
        <HotBar />
        <main
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "40px 20px",
          }}
        >
          <p>Завантаження товару…</p>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Header />
        <HotBar />
        <main
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "40px 20px",
          }}
        >
          <h1 style={{ fontSize: 24, marginBottom: 12 }}>Товар не знайдено</h1>
          {error && <p style={{ marginBottom: 16 }}>{error}</p>}
          <Link to="/shopPage">← Повернутися до каталогу</Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <HotBar />
      <ProductCard product={product} />
      <Footer />
    </>
  );
}

export default ProductPage;