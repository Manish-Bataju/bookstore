/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./Constants/**/*.{js,ts,jsx,tsx}",
    "./Forms/**/*.{js,ts,jsx,tsx}",      // Add this if Forms is at root
    "./Components/**/*.{js,ts,jsx,tsx}", // Add this if Components is at root
    "./components/**/*.{js,ts,jsx,tsx}", // Case sensitivity matters!
  ],
  theme: { 
    extend: {
      screens: {
        'tls': '1150px', // Ensure your custom 'max-tls' works
      }
    } 
  },
  plugins: [],
}