/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        mineSite: "url('./assets/mine-site.jpg')",
        mineSite2: "url('./assets/mine-site2.jpg')",
      },
    },
  },
  plugins: [],
};
