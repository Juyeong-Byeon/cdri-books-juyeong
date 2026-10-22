export const typography = {
  title1: ['24px', { lineHeight: '24px', fontWeight: '700' }],
  title2: ['22px', { lineHeight: '24px', fontWeight: '700' }],
  title3: ['18px', { lineHeight: '18px', fontWeight: '700' }],
  body1: ['20px', { lineHeight: '20px', fontWeight: '500' }],
  body2: ['14px', { lineHeight: '14px', fontWeight: '500' }],
  'body2-bold': ['14px', { lineHeight: '14px', fontWeight: '700' }],
  caption: ['16px', { lineHeight: '16px', fontWeight: '500' }],
  small: ['10px', { lineHeight: '10px', fontWeight: '500' }],
} satisfies Record<string, [string, { lineHeight: string; fontWeight: string }]>;
