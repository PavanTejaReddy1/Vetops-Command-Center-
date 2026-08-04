import { useCallback, useState } from 'react';

/**
 * Shared open/close state logic for modals, dropdowns, drawers, and popovers.
 * Keeps that boilerplate out of every component that needs a toggle.
 */
export function useDisclosure(initial = false) {
  const [isOpen, setIsOpen] = useState(initial);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return { isOpen, open, close, toggle };
}
