import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'christmas-red': '#E63946',
        'christmas-green': '#2A9D8F',
        'christmas-cream': '#F1FAEE',
        'christmas-gold': '#F4A261',
        'christmas-dark': '#264653',
        'soft-red': '#FF6B6B',
        'soft-green': '#51CF66',
        'soft-blue': '#74C0FC',
      },
    },
  },
} satisfies Config
