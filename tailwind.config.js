/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // RecallForge brand colors
        primary: {
          50: '#eff6ff',
          100: '#dbeafe', 
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#4A90E2', // Primary brand blue
          600: '#357ABD',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#7ED321', // Success green
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#F5A623', // Warning orange
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        // Child-safe grays
        child: {
          50: '#fafbfc',
          100: '#f5f7fa',
          200: '#e1e5e9',
          300: '#bdc3c7',
          400: '#95a5a6',
          500: '#7f8c8d',
          600: '#34495e',
          700: '#2c3e50',
          800: '#212f3d',
          900: '#1b2631',
        }
      },
      fontFamily: {
        'child': ['Comic Neue', 'Comic Sans MS', 'cursive'],
        'sans': ['Open Sans', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'child-xs': ['12px', '18px'],
        'child-sm': ['14px', '21px'],
        'child-base': ['16px', '24px'],
        'child-lg': ['18px', '27px'],
        'child-xl': ['20px', '30px'],
        'child-2xl': ['24px', '36px'],
        'child-3xl': ['28px', '42px'],
        'child-4xl': ['32px', '48px'],
      },
      borderRadius: {
        'child': '12px',
        'child-lg': '16px',
        'child-xl': '20px',
      },
      animation: {
        'bounce-gentle': 'bounce-gentle 1s infinite',
        'pulse-success': 'pulse-success 2s infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
      },
      keyframes: {
        'bounce-gentle': {
          '0%, 20%, 53%, 80%, 100%': {
            transform: 'translate3d(0, 0, 0)',
          },
          '40%, 43%': {
            transform: 'translate3d(0, -8px, 0)',
          },
          '70%': {
            transform: 'translate3d(0, -4px, 0)',
          },
          '90%': {
            transform: 'translate3d(0, -2px, 0)',
          },
        },
        'pulse-success': {
          '0%': {
            boxShadow: '0 0 0 0 rgba(126, 211, 33, 0.7)',
          },
          '70%': {
            boxShadow: '0 0 0 10px rgba(126, 211, 33, 0)',
          },
          '100%': {
            boxShadow: '0 0 0 0 rgba(126, 211, 33, 0)',
          },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
      },
      minHeight: {
        'touch': '44px',
      },
      minWidth: {
        'touch': '44px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}