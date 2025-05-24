import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        background: {
          DEFAULT: "#FAFAF8",
          subtle: "#F0EFEA",
          muted: "#F6F1EB",
        },
        foreground: {
          DEFAULT: "#141413",
          subtle: "#3A3935",
          muted: "#605F5B",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          soft: "#23241F",
          dark: "#191919",
        },
        secondary: {
          DEFAULT: "#C4C3BB",
          soft: "#A3A299",
          light: "#E6E4DD",
        },
        accent: {
          blue: "#61AAF2",
          green: "#7EBF8E",
          yellow: "#F2FF44",
          beige: "#EBDBBC",
          peach: "#D2886F",
          tan: "#D4A27F",
        },
        destructive: {
          DEFAULT: "#D2886F",
          foreground: "#FAFAF8",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        card: {
          DEFAULT: "#fff",
          foreground: "#141413",
        },
        white: "#fff",
        black: "#000",
        neutral: {
          50: "#FAFAF8",
          100: "#F0EFEA",
          200: "#E6E4DD",
          300: "#C4C3BB",
          400: "#A3A299",
          500: "#828179",
          600: "#605F5B",
          700: "#3A3935",
          800: "#23241F",
          900: "#141413",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.25rem",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
