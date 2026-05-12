/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        matcha: {
          50: '#F4F7EF',
          100: '#E2EBD5',
          200: '#CBE0B4',
          300: '#ABCBA0',
          primary: '#99AD7A', // 2nd color (Light Matcha)
          light: '#B3C49C',
          dark: '#546B41',    // 1st color (Dark Matcha)
        },
        cream: '#FFF8EC',     // 4th color (Cream)
        beige: '#DCCCAC',     // 3rd color (Beige)
        softpink: '#FFD1DC',
        peach: '#FFDAB9',
        glass: 'rgba(255, 255, 255, 0.65)',
      },
      fontFamily: {
        heading: ['Lora', 'serif'],
        body: ['Inter', 'sans-serif'],
        accent: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(136, 176, 75, 0.15)',
        'glass-hover': '0 12px 40px 0 rgba(136, 176, 75, 0.25)',
        'glass-inset': 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.4)',
      },
      animation: {
        'float': 'float 4s ease-in-out infinite',
        'float-delayed': 'float 4s ease-in-out 2s infinite',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-15px) rotate(2deg)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
          '50%': { opacity: 0.8, transform: 'scale(1.02)' },
        }
      }
    },
  },
  plugins: [],
}
