/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./views/**/*.{ejs, html}'],
  theme: {
    gridTemplateColumns: {
      'cust': '20px max-content 1fr',
      '2': 'grid-template-columns: repeat(2, minmax(0, 1fr))'
    },
    fontSize: {
      xs: '11.5px',
      '3xl': '1.875rem'
    },
    extend: {
      spacing: {
        '1.3': '0.3rem',
        '4.5': '1.1rem',
        '5.5': '1.35rem',
        '13': '3.2rem',
        '14.5': '3.8rem',
        '15': '3.9rem',
        '15.5': '4.4rem',
        '16': '4.8rem',
        '17': '5.2rem',
        '19': '5.4rem',
        '21': '5.8rem',
        '25': '6.4rem',
        '26': '6.7rem',
        '29': '7.2rem',
        '30': '7.6rem',
        '34': '8.5rem',
        '76': '19rem',
        '82': '20.1rem',
        '100': '73rem',
        'full': '100%',
        'min-0.5': '-0.5rem',
        'min-1': '-1rem',
        'min-4': '-4rem',
      },
      width: {
        '100': '60rem',
        '102': '70rem'
      },
      height: {
        'min-2': '-10rem'
      },
      rotate: {
        '25': '25deg',
      },
      borderWidth: {
        '6': '6px'
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
