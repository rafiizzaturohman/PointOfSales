/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./views/**/*.{ejs, html}'],
  theme: {
    extend: {
      spacing: {
        '1.3': '0.3rem',
        '4.5': '1.1rem',
        '5.5': '1.35rem',
        '15': '3.9rem',
        '16': '4.8rem',
        '17': '5.2rem',
        '26': '6.2rem',
        '76': '19rem',
        '82': '20.1rem',
        'full': '100%',
      }
    },
    variants: {
      extend: {
        display: ['group-focus']
      },
    }
  },
  plugins: [],
}
