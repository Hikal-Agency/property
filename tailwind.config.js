/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      display: ["Open Sans", "sans-serif"],
      body: ["Open Sans", "sans-serif"],
    },

    extend: {
      colors: {
        // LIGHT MODE RED COLORS
        "main-red-color": "#DA1F26",
        "main-red-color-2": "#990f13",
        "main-black-color": "#020202",
        // DARK MODE COLORS
        "main-dark-bg": "#3b3d44",
        "main-dark-bg-2": "#4f5159",
        "main-light-bg-icon": "#4f80e2",

        // LIGHT MODE COLORS
        "main-light-bg": "#dfdfdf",
        "main-light-bg-2": "#ffffff",
        "main-dark-bg-icon": "#15CDCA",
      },
    },
  },
  plugins: [],
};
