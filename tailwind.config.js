/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{html,js,svelte,ts}']
  ,
  theme: {
    colors: {
      // transparent: 'transparent',
      // current: 'currentColor',
      'cardBackground': '#0e3b93',
      'greenCardValue': '#4ed93f',
      'redCardValue': '#cb2d6f',
      'borderColor': '#cccccc',
      'playableCardBorderColor': '#ffaa00',
      'background': '#0f292f',
    },
    extend: {},
  },
  plugins: [],
}