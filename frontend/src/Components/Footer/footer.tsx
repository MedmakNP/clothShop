import styles from "./footer.module.css";
import facebook from "../../images/icons/faceBook.png";
import viber from "../../images/icons/viber.png";
import telegram from "../../images/icons/telegram.png";
import whatsapp from "../../images/icons/whatsapp.png";
import instagam from "../../images/icons/instagam.png";
import twitter from "../../images/icons/twitter.png";
import { ThemeContext } from "../../Providers/ThemeProvider";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import React from "react";

function Footer() {
  const { t } = useTranslation();
  const { type } = useContext(ThemeContext);

  return (
    <footer className={styles.footer}>
      <p className={`${styles.title} ${styles[type]}`}>
        <b>LOGO</b>
      </p>
      <p className={styles.textConnect}>+38 (066) 000 00 00</p>
      <p className={styles.textConnect}>example@mail.com</p>
      <p className={styles.text}>{t("footer.follow")}</p>
      <div className={styles.iconWrap}>
        <a href="https://www.facebook.com/">
          <div className={styles.icon}>
            <img src={facebook} alt="facebook" />
          </div>
        </a>
        <a href="https://www.instagram.com/">
          <div className={styles.icon}>
            <img src={instagam} alt="instagam" />
          </div>
        </a>
      </div>
      <p>Сlothing Store © 2025</p>
    </footer>
  );
}

export default Footer;
