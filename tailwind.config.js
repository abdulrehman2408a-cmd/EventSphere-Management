/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0B132B',
          deep: '#1C2541',
          slate: '#3A506B',
          blue: '#3A86FF',
          electric: '#4361EE',
          purple: '#7209B7',
          violet: '#8338EC',
          teal: '#06D6A0',
          amber: '#FFB703',
          rose: '#E63946'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'premium': '0 10px 30px -5px rgba(11, 19, 43, 0.08), 0 4px 6px -2px rgba(11, 19, 43, 0.03)',
        'glow': '0 0 25px -5px rgba(58, 134, 255, 0.3)',
      }
    },
  },
  plugins: [],
}
