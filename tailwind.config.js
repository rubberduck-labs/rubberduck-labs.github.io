/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      backgroundColor: {
        'custom-yellow': '#fde047',
        'custom-dark': '#1f2937',
      },
      textColor: {
        'custom-dark': '#1f2937',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      zIndex: {
        '90': '90',
        '100': '100',
      },
      keyframes: {
        'light-cone': {
          '0%': { 'border-top-color': 'rgb(254 240 138 / 0.0)' },
          '100%': { 'border-top-color': 'rgb(254 240 138 / 0.9)' }
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'pop-in': {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        }
      },
      animation: {
        'light-cone': 'light-cone 2s ease-out forwards',
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'fade-in-up': 'fade-in-up 0.5s ease-out forwards',
        'pop-in': 'pop-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards'
      }
    },
  },
  plugins: [],
};