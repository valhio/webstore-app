/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // false or 'media' or 'class'
  content: [
    "./src/**/*.{html,ts}",
  ],
  daisyui: {
    darkTheme: false,
  },
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
