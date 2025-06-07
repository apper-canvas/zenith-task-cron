/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0A0A0A',
          light: '#1A1A1A',
          dark: '#000000'
        },
        secondary: {
          DEFAULT: '#1A1A1A',
          light: '#2A2A2A',
          dark: '#0A0A0A'
        },
        accent: '#FF0000',
        surface: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a'
        }
      },
      fontFamily: { 
        sans: ['Inter', 'ui-sans-serif', 'system-ui'], 
        heading: ['Space Grotesk', 'ui-sans-serif', 'system-ui'],
        display: ['Space Grotesk', 'ui-sans-serif', 'system-ui']
      },
      boxShadow: { 
        soft: '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        'neu-light': '5px 5px 15px #d1d9e6, -5px -5px 15px #ffffff',
        'neu-dark': '5px 5px 15px rgba(0, 0, 0, 0.3), -5px -5px 15px rgba(255, 255, 255, 0.05)',
        'brutal': '8px 8px 0px #2A2A2A',
        'brutal-red': '8px 8px 0px #FF0000'
      },
      borderRadius: { 
        xl: '0.75rem', 
        '2xl': '1rem',
        none: '0px'
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem'
      }
    }
  },
  plugins: []
};