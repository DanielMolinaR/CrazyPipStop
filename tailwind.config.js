/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./App.{js,jsx,ts,tsx}", "./screens/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
    theme: {
      extend: {    
        colors: {
        'cps-red': "#D2160F",
        'cps-orange': "#E87600",
        'cps-yellow': "#F7D133",
        'cps-green': "#8CC63F",
        'cps-gray': "#3A3A39",
        'cps-brown': "#562900",
        'cps-deep-red': "#4f0606"
        },
        backgroundImage: {
          'red-background': "url('./assets/red-background.png')",
          'gray-pattern': "url('./assets/gray-pattern.png')",
        }
      },
    },
    plugins: [],
  }
  