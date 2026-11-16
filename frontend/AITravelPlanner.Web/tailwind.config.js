/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#0F9D72',
          dark: '#087A5A',
          light: '#DDF7EF',
          accent: '#14B8A6',
          50: '#F7FCFA',
          100: '#DDF7EF',
          200: '#BAEEDB',
          300: '#87E1C3',
          400: '#43CCA4',
          500: '#0F9D72',
          600: '#087A5A',
          700: '#066349',
          800: '#054E3A',
          900: '#04382B',
          950: '#022119',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          bg: '#F7FAF9',
          border: '#E4EAE7',
        },
        content: {
          DEFAULT: '#172033',
          secondary: '#667085',
        },
        status: {
          success: '#16A34A',
          warning: '#F59E0B',
          danger: '#DC4B4B',
        },
      },
    },
  },
  plugins: [],
}
