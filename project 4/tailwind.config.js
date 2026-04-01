/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#0a0e1a',
          900: '#0f1629',
          800: '#151d35',
          700: '#1c2744',
          600: '#263254',
        },
        charcoal: {
          900: '#1a1a1a',
          800: '#2a2a2a',
          700: '#3a3a3a',
          600: '#4a4a4a',
          500: '#5a5a5a',
        },
        ivory: {
          50: '#faf9f6',
          100: '#f5f3ed',
          200: '#ebe7dd',
          300: '#ddd8ca',
          400: '#ccc5b3',
        },
        gold: {
          300: '#d4c5a0',
          400: '#c4b080',
          500: '#b09a65',
          600: '#9a854f',
          700: '#7d6c3f',
        },
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        'widest-plus': '0.2em',
      },
    },
  },
  plugins: [],
};
