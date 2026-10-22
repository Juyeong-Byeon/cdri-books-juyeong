import type { Config } from 'tailwindcss';

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
      fontSize: {
        title1: ['24px', { lineHeight: '24px', fontWeight: '700' }],
        title2: ['22px', { lineHeight: '24px', fontWeight: '700' }],
        title3: ['18px', { lineHeight: '18px', fontWeight: '700' }],
        body1: ['20px', { lineHeight: '20px', fontWeight: '500' }],
        body2: ['14px', { lineHeight: '14px', fontWeight: '500' }],
        'body2-bold': ['14px', { lineHeight: '14px', fontWeight: '700' }],
        caption: ['16px', { lineHeight: '16px', fontWeight: '500' }],
        small: ['10px', { lineHeight: '10px', fontWeight: '500' }],
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
