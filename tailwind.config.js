/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        archgrille: {
          primary: '#44526A',
          secondary: '#F2F1EF',
        }
      }
    },
  },
  plugins: [],
};
