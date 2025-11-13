import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import styles from "./intro.module.css";
import { useContext } from "react";
import { BlurContext } from "../../Providers/ThemeProvider";
import React from "react";

function Intro() {
  const { t } = useTranslation();
  const { isBlurred } = useContext(BlurContext);
  return (
    <section className={`${styles.slider} ${styles[isBlurred]}`}>
      <div className={styles.overlay}></div>
      <div className={styles.infoWrap}>
        <p className={styles.title}>{t("intro.title")}</p>
        <p className={styles.text}>{t("intro.text")} </p>
        <Link to="/shopPage" className={styles.btn}>
          {" "}
          {t("intro.btn")}{" "}
        </Link>
      </div>
    </section>
  );
}

export default Intro;
