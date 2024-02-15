export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    fontFamily:{
      'gentona': ['Gentona','sans-serif'],
      'magistral': ['Magistral', 'sans-serif']
    },
    extend: {
      maxWidth: {
        '1800' : '1800px',
      }
    },
  },
  plugins: [],
}
