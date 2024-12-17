/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,php,js}",
  ],
  theme: {
    extend: {
      colors: {
        'blue': '#081C2B',
        'light-blue': '#60c0ff'
      },
      screens: {
        xxxs: { max: '390px'},
        xxs: { max: '590px'},
        xs: { max: '720px' },
        xsrev: { min: '720px' },
        ss: { max: '780px' },
        medi: { max: '900px' },
      },
      fontFamily: {
        sans: ['Nunito Sans', 'sans-serif',],
      },
    },
  },
  plugins: [],
}



