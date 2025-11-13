import React from "react";
import styles from './header.module.css';
import { useTranslation } from "react-i18next";
import { BlurContext, ThemeContext } from "../../Providers/ThemeProvider";
import { useContext } from "react";
import { FaMoon } from "react-icons/fa";
import BurgerMenu from "../BurgerMenu/burgerMenu";
import Search from "../Search/search";
import Basket from "../Basket/basket";

const Header: React.FC = () => {
  const  { toggleTheme } = useContext(ThemeContext);
  const { type } = useContext(ThemeContext);
  const { isBlurred } = useContext(BlurContext);
  const { i18n } = useTranslation();
  const { t } = useTranslation();
  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <BurgerMenu />
        <div className={`${styles.container} ${styles[isBlurred]}`}>
          <p className={styles.logo}>
            <b>LOGO</b>
          </p>
          <div className={styles.searchInner}>
            <Search />
          </div>
          <div className={styles.layoutWrap}>
            <div className={styles.layoutWrap}>
              <p
                onClick={() => i18n.changeLanguage("ua")}
                className={styles.switch}
              >
                UA
              </p>
              <p className={styles.switch}> | </p>
              <p
                onClick={() => i18n.changeLanguage("en")}
                className={styles.switch}
              >
                EN
              </p>
            </div>
            <FaMoon
              size={24}
              className={`${styles.switchTheme} ${styles[type]}`}
              onClick={toggleTheme}
            />
            <div className={styles.layoutWrap}>
              <p className={styles.login}>{t("header.login")} </p>
            </div>
          </div>
        </div>
        <Basket />
      </div>
      <div className={`${styles.search} ${styles[isBlurred]}`}>
        <Search />
      </div>
    </header>
  );
}

export default Header;
