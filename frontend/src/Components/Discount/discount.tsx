import { useTranslation } from "react-i18next";
import styles from "./discount.module.css";
import { useNavigate } from "react-router-dom";
import React from "react";

function Discount() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/shopPage");
    window.scrollTo({ top: 0 });
  };

  return (
    <section className={styles.discount}>
      <div className={styles.overlay}></div>
      <p className={styles.title}>{t("discount.title")}</p>
      <button onClick={() => handleNavigate()} className={styles.btn}>
        {t("discount.btn")}
      </button>
    </section>
  );
}

export default Discount;
