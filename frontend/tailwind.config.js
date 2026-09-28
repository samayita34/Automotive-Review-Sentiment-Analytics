/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        mono: {
          950: '#000000',
          900: '#0A0A0A',
          850: '#111111',
          800: '#171717',
          700: '#262626',
          600: '#404040',
          500: '#525252',
          400: '#737373',
          300: '#A1A1A1',
          200: '#D4D4D4',
          100: '#E5E5E5',
          50: '#FAFAFA',
          white: '#FFFFFF',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '6px',
        sm: '4px',
        md: '6px',
        lg: '8px',
      }
    },
  },
  plugins: [],
}
