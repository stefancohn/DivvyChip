/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#FFFFFF', 
      },

      fontFamily: {
        EncodeSans: ['EncodeSans'],
        EncodeSansBold: ['EncodeSansBold'],
      }
    },
  },
  plugins: [],
  corePlugins: {
  },
}