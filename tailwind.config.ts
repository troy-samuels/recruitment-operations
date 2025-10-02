import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'heading': ['Work Sans', 'system-ui', 'sans-serif'],
        'display': ['Work Sans', 'system-ui', 'sans-serif'],
        'body': ['Figtree', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'hero': ['60px', { lineHeight: '1.1' }],
        'heading': ['20px', { lineHeight: '1.4' }],
        'body': ['14px', { lineHeight: '1.5' }],
      },
      colors: {
        primary: {
          50: '#f0f4f7',
          100: '#dae6ed',
          400: '#4a6b7a',
          500: '#152B3C',
          600: '#0f1f2a',
          700: '#0a161d',
        },
        accent: {
          50: '#fdf5f3',
          100: '#fae8e3',
          400: '#e17b5a',
          500: '#D46240',
          600: '#b8502e',
          700: '#9a3e21',
        },
        success: {
          50: '#f0f9f5',
          100: '#dcf0e6',
          400: '#4ba373',
          500: '#2F906A',
          600: '#247554',
          700: '#1a5940',
        },
        cream: {
          50: '#fefdfb',
          100: '#FBF2DA',
          200: '#f7e8b5',
          300: '#f2dd90',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          900: '#111827',
        }
      },
    },
  },
  plugins: [],
}

export default config