/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,css}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Montana palette: professional blues + forest greens + neutral grays + earth accents
        pine: {
          50: "#F2F7F5",
          100: "#DDEAE4",
          200: "#B8D7C7",
          300: "#85BCA2",
          400: "#4D9B78",
          500: "#2F7E5F",
          600: "#21634A",
          700: "#194E3A",
          800: "#133C2D",
          900: "#0E2D22"
        },
        glacier: {
        // Re-themed to "Evergreen" (professional green, not too dark)
        50:  "#F3FBF7",
        100: "#E0F4EA",
        200: "#BDE7D1",
        300: "#87D3AE",
        400: "#55B987",
        500: "#2F9D6B",
        600: "#238257",
        700: "#1D6847",
        800: "#175037",
        900: "#123C2B"
        },
        basalt: {
          50: "#F6F7F9",
          100: "#ECEEF2",
          200: "#D5DAE3",
          300: "#AEB8C8",
          400: "#6E7C93",
          500: "#49566B",
          600: "#364255",
          700: "#2A3343",
          800: "#1E2533",
          900: "#141A24"
        },
        earth: {
          50: "#FBF7F0",
          100: "#F2E7D7",
          200: "#E6D0AE",
          300: "#D2AE78",
          400: "#B98842",
          500: "#9B6B2F",
          600: "#7B5224",
          700: "#5E3E1B",
          800: "#432C12",
          900: "#2D1D0B"
        }
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "Segoe UI", "Roboto", "Helvetica", "Arial", "Apple Color Emoji", "Segoe UI Emoji"],
        display: ["Montserrat", "Inter", "ui-sans-serif", "system-ui"]
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,.10)",
        lift: "0 20px 50px rgba(0,0,0,.18)"
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(14px)" },
          "100%": { opacity: 1, transform: "translateY(0)" }
        },
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 }
        },
        floaty: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" }
        },
        shimmer: {
          "0%": { transform: "translateX(-120%)" },
          "100%": { transform: "translateX(120%)" }
        },
        borderGlow: {
          "0%, 100%": { opacity: 0.35 },
          "50%": { opacity: 0.75 }
        }
      },
      animation: {
        "fade-up": "fadeUp 700ms cubic-bezier(.2,.7,.2,1) both",
        "fade-in": "fadeIn 600ms ease both",
        float: "floaty 6s ease-in-out infinite",
        shimmer: "shimmer 1.2s ease-in-out infinite",
        "border-glow": "borderGlow 2.4s ease-in-out infinite"
      }
    }
  },
  plugins: []
};
