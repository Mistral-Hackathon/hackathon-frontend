/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      backgroundColor: {
        'dark-green': '#2C3639',
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