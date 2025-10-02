/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9f4',
          100: '#daf2e4',
          200: '#b8e5cd',
          300: '#88d1ad',
          400: '#54b688',
          500: '#2c9968',
          600: '#1f7d53',
          700: '#1a6444',
          800: '#175038',
          900: '#14422f',
        },
        accent: {
          50: '#faf8f3',
          100: '#f3ede0',
          200: '#e7dbc1',
          300: '#d4a574',
          400: '#c89050',
          500: '#b87a3c',
          600: '#a66531',
          700: '#8a4f2a',
          800: '#714127',
          900: '#5d3622',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

