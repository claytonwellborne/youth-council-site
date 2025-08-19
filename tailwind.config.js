/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  safelist: [
    "p18-gradient-text"  // utility we use in headings
  ],
  theme: {
    extend: {
      colors: {
        brandRed: "#ef4444",
        brandBlue: "#2563eb"
      }
    }
  },
  plugins: []
}
