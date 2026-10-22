import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * tailwind-merge와 clsx를 결합하여 조건부 클래스를 안전하게 병합하는 공통 유틸리티
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
