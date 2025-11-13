import { useContext } from "react";
import cn from "classnames";
import { ThemeContext } from "../../Providers/ThemeProvider";

interface LayoutProps {
  children: React.ReactNode
}
const Layout:React.FC<LayoutProps> = ({ children }) => {
  const { type } = useContext(ThemeContext);
  return (
    <div
      className={cn("layout", {
        dark: type === "dark",
      })}
    >
      {children}
    </div>
  );
}

export default Layout;
