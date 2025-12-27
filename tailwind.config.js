/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rarity: {
          common: '#FFFFFF',
          rare: '#3B82F6',
          epic: '#A855F7',
          legendary: '#EF4444',
        },
        stat: {
          attack: '#EF4444',
          defense: '#3B82F6',
          heal: '#22C55E',
          speed: '#FACC15',
        },
      },
      animation: {
        'attack': 'attack 0.5s ease-in-out',
        'hit': 'hit 0.3s ease-in-out',
        'heal': 'heal 0.5s ease-in-out',
        'heart-loss': 'heartLoss 0.8s ease-in-out',
      },
      keyframes: {
        attack: {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(20px)' },
        },
        hit: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
        heal: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
        heartLoss: {
          '0%': { transform: 'scale(1)', opacity: 1 },
          '50%': { transform: 'scale(1.5)', opacity: 0.5 },
          '100%': { transform: 'scale(0)', opacity: 0 },
        },
      },
    },
  },
  plugins: [],
}
