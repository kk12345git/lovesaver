import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pink: {
          50: "#FFF0F6",
          100: "#FFD6E8",
          200: "#FFB3D1",
          300: "#FF8FBA",
          400: "#FF6FAE",
          500: "#FF4DA6",
          600: "#E03390",
          700: "#C0197A",
          800: "#9A0A63",
          900: "#75004E",
        },
        primary: "#FF6FAE",
        primaryDark: "#FF4DA6",
        accent: "#7C3AED", // Royal purple accent
        pinkBg: "#FFF0F6",
      },
      fontFamily: {
        sans: ["Nunito", "sans-serif"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        card: "0 10px 25px -5px rgba(255, 111, 174, 0.1), 0 8px 10px -6px rgba(255, 111, 174, 0.1)",
        "card-hover": "0 20px 25px -5px rgba(255, 111, 174, 0.2), 0 10px 10px -5px rgba(255, 111, 174, 0.1)",
        glass: "inset 0 0 0 1px rgba(255, 255, 255, 0.3)",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
