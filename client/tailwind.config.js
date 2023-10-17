/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    styled: true,
    themes: [
      {
        mytheme: {
          primary: "#30A7EC",
          "primary-focus": "#2b96d4",
          "primary-content": "#fcfcfc",
          "base-100": "#edf6fd",
          "base-200": "#c9e3f8",
          "base-300": "#c0dff7",
          "base-content": "#18191b",
          info: "#1A5FB5",
          error: "#dc3545",
          warning: "#ffc107",
          success: "#28a745",
          "success-content": "#ffffff",
        },
      },
    ],
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    prefix: "",
    darkTheme: "mytheme",
  },
};
