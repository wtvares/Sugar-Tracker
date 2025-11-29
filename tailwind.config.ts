import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        lavender: {
          50: '#f7f6fb',
          100: '#efeef7',
          200: '#dedcf0',
          300: '#c6c0e3',
          400: '#a59ad0',
          500: '#8b7fc0',
          600: '#7669ab',
          700: '#635792',
          800: '#524978',
          900: '#453f64'
        },
        mint: {
          50: '#f2fbf7',
          100: '#e4f8ef',
          200: '#c4f0dd',
          300: '#94e2c3',
          400: '#5fcea4',
          500: '#3dbb8d',
          600: '#2f9f77',
          700: '#287f62',
          800: '#236653',
          900: '#1e5446'
        },
        warmgray: {
          50: '#faf9f7',
          100: '#f3f1ed',
          200: '#e5e1da',
          300: '#cec8bc',
          400: '#b2aa98',
          500: '#9b927f',
          600: '#837965',
          700: '#6b6152',
          800: '#574f44',
          900: '#48423a'
        }
      },
      borderRadius: {
        'xl': '1rem'
      }
    },
  },
  plugins: [],
}
export default config
