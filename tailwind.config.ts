import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: "#D00000",
          redDark: "#A80000",
          redSoft: "#FFF1F1",
          black: "#111111",
          graphite: "#1F2933",
          muted: "#6B7280",
          line: "#E5E7EB",
          canvas: "#F8FAFC",
          white: "#FFFFFF",
        },
      },
      boxShadow: {
        glow: "0 18px 60px rgb(208 0 0 / 18%)",
        panel: "0 22px 70px rgb(17 17 17 / 10%)",
      },
      borderRadius: {
        brand: "1.25rem",
      },
      keyframes: {
        marquee: {
          from: { transform: "translate3d(0, 0, 0)" },
          to: { transform: "translate3d(-50%, 0, 0)" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translate3d(0, 18px, 0)" },
          to: { opacity: "1", transform: "translate3d(0, 0, 0)" },
        },
      },
      animation: {
        marquee: "marquee 28s linear infinite",
        "fade-up": "fade-up 600ms ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
