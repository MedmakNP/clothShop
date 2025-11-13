import React from "react";
import { Link } from "react-router-dom";
import s from "./catalog.module.css";
import type { Product } from "../../Storage/demoData"; // тип із твого demoData

/* Внутрішня картка товару для каталогу */
function CatalogCard({ product }: { product: Product }) {
  const cover = product.images?.[0]?.url;

  return (
    <Link
      className={s.card}
      to={`/product/${product.slug}`}
      aria-label={product.name}
    >
      <div className={s.media}>
        {cover && (
          <img
            className={s.img}
            src={cover}
            alt={product.name}
            loading="lazy"
          />
        )}
        <div className={s.label}>{product.name}</div>
      </div>
    </Link>
  );
}

/* Грід каталогу */
const Catalog = ({ products }: { products: Product[] }) => {
  return (
    <section className={s.wrap}>
      <div className={s.grid}>
        {products.map((p) => (
          <CatalogCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
};

export default Catalog;