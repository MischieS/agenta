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
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        // Updated primary to EduTurkia blue
        primary: {
          DEFAULT: "#2D6AB4", // EduTurkia blue
          foreground: "#FFFFFF",
          50: "#E6F0F9",
          100: "#C0D8F0",
          200: "#97BFE6",
          300: "#6EA6DC",
          400: "#4F8ED2",
          500: "#2D6AB4",
          600: "#255A9A",
          700: "#1D4A80",
          800: "#153966",
          900: "#0E294C",
        },

        // Updated secondary to EduTurkia red
        secondary: {
          DEFAULT: "#E31E24", // EduTurkia red
          foreground: "#FFFFFF",
          50: "#FCE6E7",
          100: "#F9C0C2",
          200: "#F5979A",
          300: "#F06D72",
          400: "#EC444A",
          500: "#E31E24",
          600: "#C11920",
          700: "#9F151A",
          800: "#7D1015",
          900: "#5C0C0F",
        },

        // Updated tertiary color for accents
        tertiary: {
          DEFAULT: "#666666", // EduTurkia gray
          foreground: "#FFFFFF",
        },

        // Updated accent color for highlights - using a friendly teal
        accent: {
          DEFAULT: "#00BCD4", // Bright teal - modern, youth-friendly
          foreground: "#FFFFFF",
        },

        // Updated success color
        success: {
          DEFAULT: "#4CAF50", // Friendly green
          foreground: "#FFFFFF",
        },

        // Updated urgent color
        urgent: {
          DEFAULT: "#FF5722", // Orange-red - urgent but not alarming
          foreground: "#FFFFFF",
        },

        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "#78909C", // Softer blue-gray
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
