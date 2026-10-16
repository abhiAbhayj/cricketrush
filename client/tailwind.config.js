/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cricket: {
          pitch: "#4ade80",
          pitchDark: "#15803d",
          crease: "#fef08a",
          clay: "#d97706",
          ball: "#dc2626",
          seam: "#ffffff",
          stump: "#b45309",
          gold: "#eab308",
          dark: "#0b0f19",
          card: "#131b2e",
          cardBorder: "#1e293b",
          accent: "#22c55e",
          danger: "#ef4444"
        }
      },
      fontFamily: {
        game: ['"Teko"', 'system-ui', 'sans-serif'],
        display: ['"Chakra Petch"', 'system-ui', 'sans-serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-subtle': 'bounceSubtle 1.5s infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(-3%)' },
          '50%': { transform: 'translateY(0)' },
        },
        glow: {
          '0%': { filter: 'drop-shadow(0 0 4px rgba(34, 197, 94, 0.4))' },
          '100%': { filter: 'drop-shadow(0 0 16px rgba(34, 197, 94, 0.9))' },
        }
      }
    },
  },
  plugins: [],
}
