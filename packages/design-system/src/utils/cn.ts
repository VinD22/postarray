import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Joins conditional class names and lets a later Tailwind utility win over an
 * earlier one in the same group. Every component takes a `className` prop and
 * merges it last, so a caller can always override a default.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export type { ClassValue };
