import type { Config } from 'tailwindcss';
import { typography } from './src/lib/typography';

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        palette: {
          primary: '#4880EE',
          primaryStrong: '#3269D5',
          red: '#E84118',
          gray: '#DADADA',
          lightGray: '#F2F4F6',
          white: '#FFFFFF',
          black: '#222222',
        },
        text: {
          primary: '#353C49',
          secondary: '#626B78',
          subtitle: '#8D94A0',
        },
        ui: {
          divider: '#D2D6DA',
          gray: '#B1B8C0',
        },
      },
      fontFamily: {
        sans: ['Noto Sans KR', 'sans-serif'],
      },
      fontSize: typography,
      keyframes: {
        'book-row-enter': {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'book-row-enter': 'book-row-enter 180ms ease-out',
      },
      borderRadius: {
        lg: '12px',
        md: '8px',
        sm: '4px',
      },
    },
  },
  plugins: [],
} satisfies Config;
