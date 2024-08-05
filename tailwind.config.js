/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin')
const colors = require('tailwindcss/colors')
module.exports = {
  content: [
    './src/**/*.{vue,js,ts,jsx,tsx}',
    // './node_modules/element-plus/**/*.js',
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
      emerald: colors.emerald,
      indigo: colors.indigo,
      yellow: colors.yellow,
      red: colors.red,
      primary: '#D12C25',
    },
    extend: {
      colors: {
        'login-bg': 'rgba(0, 0, 0, 0.3)',
        primary: '#ff0000',
        success: '#45b207',
        danger: '#f56c6c',
      },
      fontSize: {
        xs: ['1.2rem', { lineHeight: '1.4rem' }],
        sm: ['1.4rem', { lineHeight: '1.6rem' }],
        base: ['1.6rem', { lineHeight: '2rem' }],
        xl: ['1.8rem', { lineHeight: '2.4rem' }],
        '2xl': ['2rem', { lineHeight: '2.6rem' }],
        '3xl': ['2.2rem', { lineHeight: '2.8rem' }],
      },
    },
  },
  plugins: [
    plugin(function ({ addBase }) {
      addBase({
        html: { fontSize: '10px' }, // 设置 1rem = 10px
        body: { fontSize: '1.6rem' }, // 将全局字体默认设置为 16px
      })
    }),
  ],
  // important: true,
}
