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
      fontFamily: {
        sans: ['Nunito Sans', 'sans-serif',],
      },
    },
  },
  plugins: [],
}



