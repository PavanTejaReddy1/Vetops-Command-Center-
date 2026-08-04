import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge conditional class names and resolve Tailwind conflicts.
 * Use this everywhere instead of string concatenation so component
 * consumers can safely override classes via a `className` prop.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
