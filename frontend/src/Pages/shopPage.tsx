import React from "react";
import Footer from "../Components/Footer/footer";
import Header from "../Components/Header/header";
import HotBar from "../Components/HotBar/hotBar";
import Catalog from "../Components/Catalog/catalog";
import { useEffect, useState } from "react";
import { getProducts } from "../api/products";



function ShopPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div>Завантаження…</div>;
  return (
    <>
      <Header />
      <HotBar />
      <Catalog products={products} />
      <Footer />
    </>
  );
}

export default ShopPage;
