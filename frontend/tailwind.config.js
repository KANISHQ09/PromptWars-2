/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#0050cb",
        "on-primary": "#ffffff",
        "primary-container": "#0066ff",
        "on-primary-container": "#f8f7ff",
        "secondary": "#575e70",
        "on-secondary": "#ffffff",
        "tertiary": "#006645",
        "on-tertiary": "#ffffff",
        "background": "#f8f9fa",
        "on-background": "#191c1d",
        "surface": "#f8f9fa",
        "on-surface": "#191c1d",
        "surface-container-low": "#f3f4f5",
        "surface-container": "#edeeef",
        "surface-container-high": "#e7e8e9",
        "surface-container-highest": "#e1e3e4",
        "surface-container-lowest": "#ffffff",
        "outline": "#727687",
        "outline-variant": "#c2c6d8",
        "tertiary-fixed": "#6ffbbe",
        "on-tertiary-fixed": "#002113",
        "error": "#ba1a1a",
      },
      fontFamily: {
        sans: ['"Public Sans"', 'sans-serif'],
      },
      borderRadius: {
        'xl': '0.75rem',
      }
    },
  },
  plugins: [],
}
