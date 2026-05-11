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
          primary: '#88B04B',
          light: '#A8D08D',
          dark: '#6B8E3D',
        },
        cream: '#F5F5DC',
        beige: '#FFF8DC',
        softpink: '#FFB6C1',
        peach: '#FFDAB9',
      },
      fontFamily: {
        heading: ['Lora', 'serif'],
        body: ['Inter', 'sans-serif'],
        accent: ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
