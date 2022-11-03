/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./views/**/*.{ejs, html}'],
  theme: {
    extend: {
      spacing: {
        '26': '6.2rem',
        '16': '4.8rem',
        '17': '5.2rem',
        '15': '3.9rem',
        'full': '100%',
        '5.5': '1.35rem',
        '4.5': '1.1rem',
      }
    },
  },
  plugins: [],
}
