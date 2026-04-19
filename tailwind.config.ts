import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0D7377",
          50: "#e6f4f4",
          100: "#b0d9da",
          200: "#8ac7c8",
          300: "#54acae",
          400: "#339c9f",
          500: "#0D7377",
          600: "#0b676b",
          700: "#095053",
          800: "#073e40",
          900: "#052f31",
        },
        secondary: {
          DEFAULT: "#F4A261",
          50: "#fef4ea",
          100: "#fcddb8",
          200: "#facd96",
          300: "#f8b664",
          400: "#f7a847",
          500: "#F4A261",
          600: "#de9358",
          700: "#ad7245",
          800: "#865935",
          900: "#664428",
        },
        accent: {
          DEFAULT: "#52B788",
          50: "#edf7f2",
          100: "#c5e7d6",
          200: "#a8dbc3",
          300: "#80cba7",
          400: "#67c197",
          500: "#52B788",
          600: "#4ba67c",
          700: "#3a8161",
          800: "#2d644b",
          900: "#224d3a",
        },
        background: "#FAFAF8",
        dark: "#1A1A2E",
        muted: "#6B7280",
        card: "#FFFFFF",
        border: "#E5E7EB",
      },
      fontFamily: {
        playfair: ["var(--font-playfair)", "serif"],
        inter: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
