'use client';

import { useEffect } from 'react';

/**
 * This component suppresses hydration mismatches caused by browser extensions.
 * It forcefully removes any DOM elements that weren't rendered by React.
 */
export default function SuppressHydration() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Wait for React to finish hydrating
    const cleanup = () => {
      const html = document.documentElement;
      const body = document.body;

      // Find all direct children of body that aren't React's root
      Array.from(body.children).forEach((child) => {
        // Keep only the main Next.js root
        if (child.id !== '__next' && child.tagName !== 'SCRIPT') {
          child.remove();
        }
      });

      // Clean up any hidden extension divs in head
      const head = document.head;
      Array.from(head.children).forEach((child) => {
        if (child.tagName === 'DIV' || child.getAttribute('hidden')) {
          child.remove();
        }
      });
    };

    // Run after hydration
    requestAnimationFrame(cleanup);
    setTimeout(cleanup, 0);
    setTimeout(cleanup, 100);
  }, []);

  return null;
}
