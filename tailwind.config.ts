/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
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
        border: "#E5E3DD",
        input: "#E5E3DD",
        ring: "#1B1B1B",
        background: "#F4F3F0",
        foreground: "#1B1B1B",
        primary: {
          DEFAULT: "#1E473F",
          foreground: "#FBFBFB",
        },
        secondary: {
          DEFAULT: "#E06132",
          foreground: "#FBFBFB",
        },
        destructive: {
          DEFAULT: "#FF7373",
          foreground: "#F4F3F0",
        },
        info: {
          DEFAULT: "#65D0E7",
          foreground: "#1B1B1B",
        },
        muted: {
          DEFAULT: "#E5E3DD",
          foreground: "#64748B",
        },
        accent: {
          DEFAULT: "#E5E3DD",
          foreground: "#1B1B1B",
        },
        popover: {
          DEFAULT: "#ffffff",
          foreground: "#1B1B1B",
        },
        card: {
          DEFAULT: "#ffffff",
          foreground: "#1B1B1B",
        },
      },
      borderRadius: {
        lg: "0.5rem",
        md: "calc(0.5rem - 2px)",
        sm: "calc(0.5rem - 4px)",
      },
      screens: {
        "3xl": "1800px",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        holographicShine: {
          "0%": { backgroundPosition: "left" },
          "50%": { backgroundPosition: "right" },
          "100%": { backgroundPosition: "left" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "holographic-shine": "holographicShine 8s infinite linear",
      },
      fontFamily: {
        sans: ["var(--font-open_Sans)"],
        helveticaNeue: ["var(--font-helveticaNeue)"],
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/container-queries"),
    require("@tailwindcss/typography"),
  ],
};
