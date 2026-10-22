import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';
import { typography } from './typography';

const mergeClasses = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: Object.keys(typography) }],
    },
  },
});

/**
 * tailwind-merge와 clsx를 결합하여 className 값을 안전하게 병합하는 공통 유틸리티
 */
export function cx(...inputs: ClassValue[]): string {
  return mergeClasses(clsx(inputs));
}
