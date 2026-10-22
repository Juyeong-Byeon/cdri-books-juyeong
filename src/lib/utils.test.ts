import { describe, expect, it } from 'vitest';
import { typography } from './typography';
import { cx } from './utils';

describe('cx typography', () => {
  it.each(Object.keys(typography))('preserves text-%s together with a text color', (token) => {
    expect(cx(`text-${token}`, 'text-text-primary')).toBe(`text-${token} text-text-primary`);
  });

  it('merges font sizes and text colors independently', () => {
    expect(cx('text-title1 text-text-primary', 'text-caption text-text-secondary')).toBe(
      'text-caption text-text-secondary'
    );
  });
});
