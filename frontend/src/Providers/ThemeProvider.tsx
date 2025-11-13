import React, { createContext, useMemo, useState, useEffect } from "react";

interface ThemeContextType {
  type: string;
  toggleTheme: () => void;
}

interface BlurContextType {
  isBlurred: string;
  toggleBlur: () => void;
}
interface ThemeProviderProps {
  children: React.ReactNode;
} 

export const ThemeContext = createContext<ThemeContextType>({
  type: "light",
  toggleTheme: () => {}
});

export const BlurContext = createContext<BlurContextType>({
  isBlurred: "",
  toggleBlur: () => {}
});

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [type, setType] = useState<string>("light");
  const [isBlurred, setIsBlurred] = useState<string>("");

  const toggleBlur = () => {
    setIsBlurred((prevType) => (prevType === "" ? "blur" : ""));
  };

  useEffect(() => {
    if (isBlurred) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
  }, [isBlurred]);

  const toggleTheme = () => {
    setType((prevType) => (prevType === "light" ? "dark" : "light"));
  };

  const theme = useMemo(() => ({ type, toggleTheme }), [type]);
  const blurValue = useMemo(() => ({ isBlurred, toggleBlur }), [isBlurred]);

  return (
    <ThemeContext.Provider value={theme}>
      <BlurContext.Provider value={blurValue}>
        {children}
      </BlurContext.Provider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
