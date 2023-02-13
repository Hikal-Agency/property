import { createContext, useState, useMemo } from "react";
import { createTheme } from "@mui/material/styles";

// color design tokens export
export const tokens = (mode) => ({
  ...(mode === "dark"
    ? {
        primary: {
          100: "#d0f5f4",
          200: "#a1ebea",
          300: "#73e1df",
          400: "#44d7d5",
          500: "#15cdca",
          600: "#11a4a2",
          700: "#0d7b79",
          800: "#085251",
          900: "#042928",
        },
      }
    : {
        // main-red-color
        primary: {
          100: "#f8d2d4",
          200: "#f0a5a8",
          300: "#e9797d",
          400: "#e14c51",
          500: "#da1f26",
          600: "#ae191e",
          700: "#831317",
          800: "#570c0f",
          900: "#2c0608",
        },
        secondary: {
          100: "#ebcfd0",
          200: "#d69fa1",
          300: "#c26f71",
          400: "#ad3f42",
          500: "#990f13",
          600: "#7a0c0f",
          700: "#5c090b",
          800: "#3d0608",
          900: "#1f0304",
        },
      }),
});

// mui theme settings
export const themeSettings = (mode) => {
  const colors = tokens(mode);
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            // palette values for dark mode
            primary: {
              main: colors.primary[500],
              contrastText: "#ffffff",
            },
          }
        : {
            // palette values for light mode
            primary: {
              main: colors.primary[500],
            },
            secondary: {
              main: colors.secondary[500],
            },
          }),
    },
  };
};

// context for color mode
export const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

export const useMode = () => {
  const [mode, setMode] = useState("dark");

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () =>
        setMode((prev) => (prev === "light" ? "dark" : "light")),
    }),
    []
  );

  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return [theme, colorMode];
};
