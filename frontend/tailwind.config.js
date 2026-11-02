/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fbf9f1',
          100: '#f6f2dd',
          200: '#eee4bb',
          300: '#e3d091',
          400: '#d7b966',
          500: '#cb9f40',
          600: '#b48332',
          700: '#946429',
          800: '#794f26',
          900: '#654224',
        },
        rosewood: {
          50: '#fdf4f4',
          100: '#fce8e8',
          200: '#fad5d5',
          300: '#f4b4b4',
          400: '#ea8686',
          500: '#dc5d5d',
          600: '#c64040',
          700: '#a63333',
          800: '#892d2d',
          900: '#732a2a',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        serif: ['Cinzel', 'serif'],
      }
    },
  },
  plugins: [],
}
