/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{tsx,ts,js,jsx,html}'],
  theme: {
    extend: {
      colors: {
        primary: '#9F1950',
        gold: '#FBAC00',
        orange: '#F36F21',
        black: '#000000',
        warmWhite: '#FAF8F6',
        surface: '#F3F0ED',
        ash: {
          900: '#0d0c0b',
          800: '#1c0a02',
          200: '#e8e8e8',
        },
        text: {
          primary: '#E8E8E8',
          muted: '#B0B0B0',
        },
        fire: {
          orange: '#F36F21',
          gold: '#FBAC00',
          amber: '#FFB347',
          crimson: '#9F1950',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['Inter', 'sans-serif'],
        cond: ['"Inter Condensed"', 'sans-serif'],
      },
      screens: {
        xs: '320px',
        sm: '375px',
        md: '425px',
        lg: '768px',
        xl: '1024px',
        '2xl': '1440px',
        '3xl': '1920px',
      },
    },
  },
  plugins: [],
};
