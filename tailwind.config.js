/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./views/**/*.{ejs, html}'],
  theme: {
    extend: {
      spacing: {
        '26': '6.2rem',
        '16': '4.8rem',
        '15': '3.9rem',
        'full': '100%'
      }
    },
  },
  plugins: [],
}
