import React, { useMemo, useState } from "react";
import s from "./slide.module.css";

/* === ТИПИ ПІД ТВОЮ БД === */
type Size = "XS" | "S" | "M" | "L" | "XL";
type VariantSize = { size: Size; sku: string; inStock: boolean; price?: number };
type Variant = { colorId: string; colorHex: string; sizes: VariantSize[] };
export type Product = {
  id: string;
  slug: string;
  title: string;
  price: number;
  images: string[];       // product-level галерея
  tags?: string[];
  variants: Variant[];    // варіант = колір, усередині розміри
  description?: string;
};

/* === ДОПОМОЖНІ === */
function useSelectedMedia(product: Product, colorIndex: number, mainIndex: number) {
  // Проста логіка: якщо масив images відповідає порядку кольорів,
  // показуємо зображення за індексом кольору; інакше—вибране з галереї.
  const colorImage = product.images[colorIndex] ?? product.images[0];
  const main = product.images[mainIndex] ?? colorImage ?? product.images[0];
  return { main, colorImage };
}

function formatPrice(n: number) {
  return new Intl.NumberFormat("uk-UA").format(n) + " грн";
}

export function ProductCard({
  product,
  onAddToCart,
}: {
  product: Product;
  onAddToCart?: (payload: { sku: string; qty: number }) => void;
}) {
  const [colorIndex, setColorIndex] = useState(0);
  const [mainIndex, setMainIndex] = useState(0);
  const [size, setSize] = useState<Size | null>(null);
  const selectedVariant = product.variants[colorIndex];

  const { main } = useSelectedMedia(product, colorIndex, mainIndex);

  // Ціна до показу (можеш розширити логіку, якщо є оверрайди в size/variant)
  const displayPrice = useMemo(() => {
    const v = selectedVariant;
    const s = v?.sizes.find((x) => x.size === size || size === null);
    return s?.price ?? product.price;
  }, [product.price, selectedVariant, size]);

  // SKU для додавання в кошик — беремо з вибраного розміру
  const currentSku = useMemo(() => {
    const s = selectedVariant?.sizes.find(x => x.size === size);
    return s?.sku ?? null;
  }, [selectedVariant, size]);

  return (
    <section className={s.wrap}>
      <div className={s.grid}>
        {/* ГАЛЕРЕЯ */}
        <div className={s.gallery}>
          <div className={s.main}>
            {main && <img src={main} alt={product.title} />}
          </div>

          <div className={s.thumbs}>
            {product.images.map((src, i) => (
              <button
                key={i}
                className={`${s.th} ${i === mainIndex ? s.active : ""}`}
                aria-label={`Фото ${i + 1}`}
                onClick={() => setMainIndex(i)}
              >
                <img src={src} alt="" aria-hidden />
              </button>
            ))}
          </div>
        </div>

        {/* ІНФО */}
        <div className={s.info}>
          <div className={s.breadcrumbs}>
            <a href="/shop">Каталог</a> <span>•</span> <span>{product.title}</span>
          </div>

          <h1 className={s.title}>{product.title}</h1>

          <div className={s.priceRow}>
            <div className={s.price}>{formatPrice(displayPrice)}</div>
            {/* за потреби: <div className={s.old}>2199 грн</div> */}
          </div>

          {/* КОЛІР */}
          <div className={s.block}>
            <div className={s.label}>Колір</div>
            <div className={s.swatches}>
              {product.variants.map((v, i) => (
                <button
                  key={v.colorId}
                  className={`${s.sw} ${i === colorIndex ? s.swActive : ""}`}
                  style={{ background: v.colorHex }}
                  aria-label={v.colorId}
                  onClick={() => {
                    setColorIndex(i);
                    setMainIndex(i < product.images.length ? i : 0); // підміняємо фото під колір
                    setSize(null);
                  }}
                />
              ))}
            </div>
          </div>

          {/* РОЗМІРИ */}
          <div className={s.block}>
            <div className={s.label}>Розмір</div>
            <div className={s.sizes}>
              {selectedVariant?.sizes.map((x) => (
                <button
                  key={x.sku}
                  className={`${s.size} ${size === x.size ? s.sizeActive : ""}`}
                  onClick={() => setSize(x.size)}
                  disabled={!x.inStock}
                  aria-disabled={!x.inStock}
                  title={!x.inStock ? "Немає в наявності" : ""}
                >
                  {x.size}
                </button>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className={s.ctaRow}>
            <button
              className={s.cta}
              disabled={!currentSku}
              onClick={() => currentSku && onAddToCart?.({ sku: currentSku, qty: 1 })}
            >
              Додати в кошик
            </button>
            <div className={s.notes}>
              Безкоштовна доставка від 1500 грн · Повернення 30 днів
            </div>
          </div>

          {/* ВКЛАДКИ/ОПИС */}
          <div className={s.tabs}>
            <details open>
              <summary>Опис</summary>
              <p>
                {product.description ??
                  "М’яка бавовна з флісом, комфортна посадка, базові кольори. Підійде для тренувань і на кожен день."}
              </p>
            </details>
            <details>
              <summary>Склад і догляд</summary>
              <p>80% бавовна, 20% поліестер. Машинне прання при 30°C, делікатний режим.</p>
            </details>
            <details>
              <summary>Доставка та оплата</summary>
              <p>Нова Пошта по Україні. Оплата карткою (LiqPay/WayForPay) або накладений платіж.</p>
            </details>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductCard;
