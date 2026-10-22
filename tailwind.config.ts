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
          red: '#E84118',
          gray: '#DADADA',
          lightGray: '#F2F4F6',
          white: '#FFFFFF',
          black: '#222222',
        },
        text: {
          primary: '#353C49',
          secondary: '#6D7582',
          subtitle: '#8D94A0',
        },
      },
      fontFamily: {
        sans: ['Noto Sans KR', 'sans-serif'],
      },
      fontSize: typography,
      borderRadius: {
        lg: '12px',
        md: '8px',
        sm: '4px',
      },
    },
  },
  plugins: [],
} satisfies Config;
