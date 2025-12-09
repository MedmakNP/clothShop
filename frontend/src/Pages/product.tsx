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

// Маппер: ApiProduct -> CardProduct
function mapApiProductToCardProduct(p: ApiProduct): CardProduct {
  // зображення з бекенду
  const images = (p.images ?? []).map((img) => img.url);

  return {
    id: p.id,                       // ✅ число
    slug: p.slug,
    name: p.name,                   // ✅ дивись, не title
    basePrice: p.basePrice,
    description: p.description ?? undefined,
    images,
    variants:
      p.variants?.map((v) => ({
        id: v.id,
        sku: v.sku,
        size: v.size,
        color: v.color,
        price: v.price ?? undefined,
        stock: v.stock ?? undefined,
      })) ?? [],
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