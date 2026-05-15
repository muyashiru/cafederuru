/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sunset: {
          50: '#FFFBDA',
          100: '#FFEC9E',
          200: '#FDE49B',
          300: '#FCD972',
          primary: '#FFBB70', 
          light: '#FFC88A',
          dark: '#ED9455',    
        },
        cream: '#FFFBDA',     
        beige: '#FFEC9E',     
        softpink: '#FFBB70',
        peach: '#ED9455',
        glass: 'rgba(255, 255, 255, 0.65)',
      },
      fontFamily: {
        heading: ['Lora', 'serif'],
        body: ['Inter', 'sans-serif'],
        accent: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(237, 148, 85, 0.15)',
        'glass-hover': '0 12px 40px 0 rgba(237, 148, 85, 0.25)',
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
