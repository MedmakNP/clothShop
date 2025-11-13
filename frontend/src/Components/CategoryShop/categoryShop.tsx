import styles from "./categoryShop.module.css";
import "swiper/css";
import categoryData from "../../Storage/categoryData";
import { BlurContext, ThemeContext } from "../../Providers/ThemeProvider";
import { useContext} from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import React from "react";

function CategoryShop() {
  const { type } = useContext(ThemeContext);
  const { t } = useTranslation();
  const { isBlurred } = useContext(BlurContext);
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/shopPage`);
    window.scrollTo({ top: 0 });
  };
  return (
    <section className={`${styles.categoryShop} ${styles[isBlurred]}`}>
      <div className={styles.container}>
        <h1 className={styles.title}>{t("category.title")}</h1>
        <div className={styles.categoryWrap}>
          {categoryData.map((val) => (
              <div className={`${styles.slide} ${styles[type]}`}>
                <img className={styles.img} src={val.img} alt={val.text}               
                />
                <button onClick={() => handleNavigate()} className={styles.btn}>
                  {val.text}
                </button>
              </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default CategoryShop;
