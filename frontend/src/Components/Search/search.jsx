import { useTranslation } from "react-i18next";
import style from "./search.module.css";
import { IoIosSearch } from "react-icons/io";

function Search() {
  const { t } = useTranslation();
  return (
    <form className={style.search}>
      <input type="search" className={style.searchInput} placeholder={t("header.input")} />
      <IoIosSearch size={24} className={style.icon} />
    </form>
  );
}

export default Search;
