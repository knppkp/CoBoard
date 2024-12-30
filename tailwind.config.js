/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'basegreen': '#006b62',
        'basegreenhover': '#005952',
        'lightgreen': '#6A9C89',
        'lightergreen': '#C4DAD2',
        'lightergreenhover': '#B7CEC6',
        'darkgreen': '#003733',
        'graygreen': '#B0CDC3',
        'gray1': '#666666',
        'graybg': '#D9D9D9',
        'lightgray': '#B2B2B2',
        'lightergray': '#C7C7C7',
        'salmon': '#FF7840',
        'darkorange': '#C85B2E',
        'blackorange': '#5B2813',
        'lightorange': '#FFD2BF',
        'redselect': '#C73E2E',
        'almortwhite': '#FFFFFF'
      },
      height: {
        '500': '500px',
        '630': '630px',
        '800': '800px'
      },
      width: {
        '340': '340px',
        '350': '350px',
        '360': '360px',
        '380': '380px',
        '400': '400px',
        '420': '420px',
        '430': '430px',
        '450': '450px',
        '500': '500px',
        'panel': '560px',
        '600': '600px',
        '630': '630px',
        '750': '750px'
      },
      transitionDuration: {
        '400': '400ms',
      },
      fontFamily: {
        sans: ['"Istok Web"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

