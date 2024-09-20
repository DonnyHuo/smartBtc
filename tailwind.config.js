/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        grey: "#919090",
      },
      fontFamily: {
        medium: "Poppins-Medium",
        semiBold: "Poppins-SemiBold",
      },
    },
  },
  plugins: [],
};
