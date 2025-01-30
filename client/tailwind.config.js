/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    extendUtilities: {
      "flex-center": "flex flex-row items-center justify-center",
      "flex-between": "flex flex-row items-center justify-between",
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".flex-center": {
          display: "flex",
          "align-items": "center",
          "justify-content": "center",
        },
        ".flex-between": {
          display: "flex",
          "align-items": "center",
          "justify-content": "space-between",
        },
        ".flex-around": {
          display: "flex",
          "align-items": "center",
          "justify-content": "space-around",
        },
        ".flex-start": {
          display: "flex",
          "align-items": "start",
          "justify-content": "start",
        },
      });
    },
  ],
}

