import { useContext, useState } from "react";
import { BsFillBasket2Fill } from "react-icons/bs";
import empty from "../../images/emptyBusket.png";
import style from "./basket.module.css";
import { BlurContext, ThemeContext  } from "../../Providers/ThemeProvider";
import React from "react";
function Basket() {
  const [open, setOpen] = useState("");
  const { toggleBlur } = useContext(BlurContext);
    const { type } = useContext(ThemeContext);

  const henddleClick = () => {
    setOpen((prev) => (prev === "" ? "open" : ""));
    toggleBlur();
  };
  return (
    <section className={style.container}>
      <BsFillBasket2Fill
        className={type}
        onClick={henddleClick}
        size={24}
      />
      <div className={`${style.basketMenu} ${style[open]}`}>
        <p className={style.title}>Shopping cart</p>
        <div className={style.basketInner}>
          <img className={style.emptyImg} src={empty} alt="empty" />
          <p className={style.text}>Your shopping cart is empty.</p>
          <button onClick={henddleClick} className={style.btn}>
            Continue shopping
          </button>
        </div>
      </div>
      <div className={open === "" ? "" : style.overlay}></div>
    </section>
  );
}

export default Basket;
