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
        '21': '5.8rem',
        '26': '6.7rem',
        '29': '7.2rem',
        '76': '19rem',
        '82': '20.1rem',
        '100': '73rem',
        'full': '100%',
        'min-2': '-1rem',
        'min-0.5': '-0.5rem',
      },
      rotate: {
        '25': '25deg',
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
