/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "login-bg": "rgba(0, 0, 0, 0.3)",
      },
    },
  },
  plugins: [],
  // important: true,
}
