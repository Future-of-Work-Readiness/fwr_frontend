/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#3A7AFE',
          secondary: '#1D2433',
        },
        text: {
          primary: '#1C1C1C',
          secondary: '#4B5563',
        },
        bg: {
          light: '#FFFFFF',
          muted: '#F7F9FC',
        },
        border: {
          DEFAULT: '#E5E7EB',
        },
        success: {
          DEFAULT: '#4CAF50',
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#4CAF50',
          600: '#16a34a',
        },
        warning: {
          DEFAULT: '#EAB308',
          50: '#fffbeb',
          100: '#fef3c7',
          500: '#EAB308',
          600: '#d97706',
        },
        danger: {
          DEFAULT: '#DC2626',
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#DC2626',
          600: '#dc2626',
        },
      },
    },
  },
  plugins: [],
}
