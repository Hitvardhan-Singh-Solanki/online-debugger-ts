import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Night Owl inspired colors
        nightOwl: {
          bg: "#011627",
          bgLight: "#01111d",
          bgDark: "#010e1a",
          text: "#d6deeb",
          textDim: "#637777",
          accent: "#c792ea",
          blue: "#82aaff",
          cyan: "#7fdbca",
          green: "#addb67",
          orange: "#f78c6c",
          red: "#ef5350",
          yellow: "#ffcb8b",
          selection: "#1d3b53",
          lineHighlight: "#152B3D",
        },
        light: {
          bg: "#fafafa",
          bgSecondary: "#ffffff",
          text: "#403f53",
          textDim: "#6b6b6b",
          border: "#e0e0e0",
          accent: "#7e57c2",
          highlight: "#f0f4f8",
        },
      },
      fontFamily: {
        mono: ["Monaco", "Menlo", "Ubuntu Mono", "Consolas", "monospace"],
      },
      animation: {
        "slide-in": "slideIn 0.2s ease-out",
        "fade-in": "fadeIn 0.3s ease-out",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
      },
      keyframes: {
        slideIn: {
          "0%": { transform: "translateX(10px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
