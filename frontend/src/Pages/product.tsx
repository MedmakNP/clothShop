import React from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../Components/Header/header";
import HotBar from "../Components/HotBar/hotBar";
import Footer from "../Components/Footer/footer";
import { demoProducts } from "../Storage/demoData";
import ProductCard from "../Components/ProductCard/productCard"; 
// ^^^ ПЕРЕВІР ШЛЯХ!
// Тут має бути імпорт твого великого компоненту з slide.module.css
// Наприклад:
// import ProductCard from "../Components/ProductPage/slide";
// або як у тебе реально називається теку/файл.

function ProductPage() {
  const { slug } = useParams<{ slug: string }>();

  const product = demoProducts.find((p) => p.slug === slug);

  if (!product) {
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
          <p style={{ marginBottom: 16 }}>
            Можливо, він був видалений або посилання некоректне.
          </p>
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
