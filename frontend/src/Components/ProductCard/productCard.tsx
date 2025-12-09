import React, { useMemo, useState } from "react";
import s from "./slide.module.css";

/* === ТИП ПІД ТВОЄ API === */

export type ProductVariant = {
  id: number;
  sku: string;
  size: string;
  color: string;
  price?: number;
  stock?: number;
};

export type Product = {
  id: number;
  slug: string;
  name: string;
  basePrice: number;
  description?: string;
  images: string[];
  variants: ProductVariant[];
};

/* === ДОПОМОЖНІ === */

function formatPrice(n: number) {
  return new Intl.NumberFormat("uk-UA").format(n) + " грн";
}

export function ProductCard({
  product,
  onAddToCart,
}: {
  product: Product;
  onAddToCart?: (payload: { variantId: number; qty: number }) => void;
}) {
  const variants = product.variants ?? [];

  // Унікальні кольори з варіантів
  const colors = useMemo(
    () => Array.from(new Set(variants.map((v) => v.color))),
    [variants]
  );

  // обраний колір
  const [selectedColor, setSelectedColor] = useState<string>(
    colors[0] ?? ""
  );

  // усі розміри для обраного кольору
  const sizesForColor = useMemo(
    () =>
      variants
        .filter((v) => v.color === selectedColor)
        .map((v) => v.size),
    [variants, selectedColor]
  );

  // обраний розмір
  const [selectedSize, setSelectedSize] = useState<string>(
    sizesForColor[0] ?? ""
  );

  // обраний варіант color+size
  const selectedVariant = useMemo(
    () =>
      variants.find(
        (v) => v.color === selectedColor && v.size === selectedSize
      ),
    [variants, selectedColor, selectedSize]
  );

  const isOutOfStock =
    selectedVariant && typeof selectedVariant.stock === "number"
      ? selectedVariant.stock <= 0
      : false;

  // Ціна до показу
  const displayPrice =
    selectedVariant?.price ?? product.basePrice;

  // основне зображення (просто перше, або колись прив’яжеш по кольору)
  const mainImage = product.images[0];

  return (
    <section className={s.wrap}>
      <div className={s.grid}>
        {/* ГАЛЕРЕЯ (спрощено: одна головна + всі превʼю) */}
        <div className={s.gallery}>
          <div className={s.main}>
            {mainImage && (
              <img src={mainImage} alt={product.name} />
            )}
          </div>

          <div className={s.thumbs}>
            {product.images.map((src, i) => (
              <button
                key={i}
                className={s.th}
                aria-label={`Фото ${i + 1}`}
              >
                <img src={src} alt="" aria-hidden />
              </button>
            ))}
          </div>
        </div>

        {/* ІНФО */}
        <div className={s.info}>
          <div className={s.breadcrumbs}>
            <a href="/shop">Каталог</a> <span>•</span>{" "}
            <span>{product.name}</span>
          </div>

          <h1 className={s.title}>{product.name}</h1>

          <div className={s.priceRow}>
            <div className={s.price}>
              {formatPrice(displayPrice)}
            </div>
          </div>

          {/* КОЛІР */}
          {colors.length > 0 && (
            <div className={s.block}>
              <div className={s.label}>Колір</div>
              <div className={s.swatches}>
                {colors.map((color) => (
                  <button
                    key={color}
                    className={`${s.sw} ${
                      selectedColor === color ? s.swActive : ""
                    }`}
                    style={{ background: color }}
                    aria-label={color}
                    onClick={() => {
                      setSelectedColor(color);
                      const sizes = variants
                        .filter((v) => v.color === color)
                        .map((v) => v.size);
                      setSelectedSize(sizes[0] ?? "");
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* РОЗМІР */}
          {sizesForColor.length > 0 && (
            <div className={s.block}>
              <div className={s.label}>Розмір</div>
              <div className={s.sizes}>
                {sizesForColor.map((sz) => {
                  const v = variants.find(
                    (x) =>
                      x.color === selectedColor &&
                      x.size === sz
                  );
                  const disabled = !v || (v.stock ?? 0) <= 0;

                  return (
                    <button
                      key={`${selectedColor}-${sz}`}
                      className={`${s.size} ${
                        selectedSize === sz ? s.sizeActive : ""
                      }`}
                      onClick={() => setSelectedSize(sz)}
                      disabled={disabled}
                      aria-disabled={disabled}
                      title={
                        disabled ? "Немає в наявності" : ""
                      }
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className={s.ctaRow}>
            <button
              className={s.cta}
              disabled={!selectedVariant || isOutOfStock}
              onClick={() =>
                selectedVariant &&
                onAddToCart?.({
                  variantId: selectedVariant.id,
                  qty: 1,
                })
              }
            >
              {isOutOfStock
                ? "Немає в наявності"
                : "Додати в кошик"}
            </button>
            <div className={s.notes}>
              Безкоштовна доставка від 1500 грн · Повернення
              30 днів
            </div>
          </div>

          {/* ОПИС */}
          <div className={s.tabs}>
            <details open>
              <summary>Опис</summary>
              <p>
                {product.description ??
                  "Опис товару скоро зʼявиться."}
              </p>
            </details>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductCard;