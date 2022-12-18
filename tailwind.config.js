const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        dwhite: '#ddd',
        'bg-dark': '#272727',
        'bg-light': '#353535',
        'bg-dwhite': 'hsl(0deg 0% 85% / 6%)',
        'almost-gray': '#7a7a7a',
        'black-inv': 'rgba(0,0,0,.06)',
        bmatch: '#2c2c2c',
      },
      fontFamily: {
        sans: ['Lato', ...defaultTheme.fontFamily.sans],
      },
      boxShadow: {
        tight: '0px 2px 2px rgba(0, 0, 0, 0.25)',
        floating: '0px 11px 10px rgba(0, 0, 0, 0.05)',
      },
      dropShadow: {
        logo: '4px 9px 19px rgba(101, 101, 101, 0.13)',
      },
      screens: {
        '3xl': '1600px',
      },
    },
  },
  plugins: [],
};
