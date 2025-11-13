import styles from "./hotBar.module.css";
import { Link } from "react-router-dom";
import { BlurContext, ThemeContext } from "../../Providers/ThemeProvider";
import { useContext } from "react";
import { useTranslation } from "react-i18next";

function HotBar() {
  const { type } = useContext(ThemeContext);
  const { isBlurred } = useContext(BlurContext);
  const { t } = useTranslation();
  return (
    <nav className={`${styles.hotBar} ${styles[isBlurred]}`}>
      <div className={styles.container}>
        <Link to="/TechWorld-TypeScript" className={`${styles.link} ${styles[type]}`}>
          {t("hotBar.home")}
        </Link>
        <Link to="/TechWorld-TypeScript/shopPage" className={`${styles.link} ${styles[type]}`}>
          {t("hotBar.shop")}
        </Link>
        <Link to="/TechWorld-TypeScript/buyersPage" className={`${styles.link} ${styles[type]}`}>
          {t("hotBar.buyers")}
        </Link>
        <Link to="/TechWorld-TypeScript/blogPage" className={`${styles.link} ${styles[type]}`}>
          {t("hotBar.blog")}
        </Link>
        <Link to="/TechWorld-TypeScript/contactsPage" className={`${styles.link} ${styles[type]}`}>
          {t("hotBar.contacts")}
        </Link>
      </div>
    </nav>
  );
}

export default HotBar;
