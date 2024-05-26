/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'mistral-red': '#e83429',
        'mistral-yellow': '#F7CF46',
      },
      backgroundImage: {
      },
      backgroundColor: {
        'dark-green': '#2C3639',
        'dark-orange': '#e83429',
        'light-orange': '#F7CF46',

      },
      keyframes: {
        typing: {
          '0%': { width: '0%' },
          '100%': { width: '100%' }
        },
        blink: {
          '0%, 100%': { borderColor: 'transparent' },
          '50%': { borderColor: 'black' }
        }
      },
      animation: {
        typing: 'typing 4s steps(9) 1',
        blink: 'blink 1s step-end infinite'
      },
      height: {
        '1/10': '10%',
        '9/10': '90%',
      },
      width:{
        '1/10': '10%',
        '1/20': '5%',
        '7/10': '70%',
      }
    },
  },
  plugins: [],
}