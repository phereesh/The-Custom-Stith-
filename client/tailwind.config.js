/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'tailor-gold': '#3b82f6',
        'tailor-black': '#0a0a0a',
        'tailor-darker': '#1a1a1a',
        'tailor-gold-light': '#60a5fa',
        'tailor-gold-dark': '#1d4ed8',
      },
      fontFamily: {
        'serif': ['serif'],
      },
    },
  },
  plugins: [],
}

