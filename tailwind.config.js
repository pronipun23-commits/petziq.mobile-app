/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.tsx', './src/**/*.{js,jsx,ts,tsx}'],

  presets: [require('nativewind/preset')],

  theme: {
    extend: {
      colors: {
        brand: {
          50: '#e9fff8',
          100: '#d1f7ee',
          200: '#a5efd7',
          300: '#6fe4c0',
          400: '#2ec7a2',
          500: '#1aa385',
          600: '#137c69',
          700: '#105f52',
          800: '#0d4a41',
          900: '#0a2927',
        },
        accent: {
          400: '#7dd3fc',
          500: '#38bdf8',
        },
      },
      boxShadow: {
        glow: '0 20px 60px rgba(26, 163, 133, 0.35)',
      },
    },
  },
  plugins: [],
};