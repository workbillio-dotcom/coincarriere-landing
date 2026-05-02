/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['../index.html'],
  theme: {
    extend: {
      colors: {
        brand:        '#0077B6',
        'brand-dark': '#005a8a',
        'brand-ink':  '#052238',
        lime:         '#b4dc02',
        'lime-dark':  '#9bbf00',
        paper:        '#FAFAF7',
        ink:          '#0A0F1A',
      },
      fontFamily: {
        display: ['Sora', 'sans-serif'],
        body:    ['Inter', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
    },
  },
  safelist: [],
  plugins: [],
}
