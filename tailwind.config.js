/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './src/renderer/src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      keyframes: {
        countanimate: {
          '0%': { transform: 'rotateY(0) translateY(40px)', opacity: '0' },
          '100%': { transform: 'rotateY(360deg) translateY(0)', opacity: '1' }
        }
      },
      animation: {
        countanimate: 'countanimate 1s ease-out forwards'
      }
    }
  },
  plugins: []
}
