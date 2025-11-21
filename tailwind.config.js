const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  darkMode: 'class', // Enable class-based dark mode
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Custom dark theme colors
        dark: {
          bg: '#0b1220',
          card: '#0f1724',
          muted: '#9ca3af',
          text: '#e6eef8',
          border: '#1f2937',
          accent: '#60a5fa',
        },
      },
    },
  },
  plugins: [],
};