'use client';

import { useEffect } from 'react';

/**
 * Component that cleans up browser extension injected elements
 * to prevent React hydration mismatches
 */
export default function ExtensionCleanup() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Mark body to prevent extensions from injecting
    document.body.setAttribute('data-react-hydrated', 'true');

    const removeExtensionElements = () => {
      // Common extension selectors
      const selectors = [
        '.supplier-app-container',
        '.supplier-app-mini',
        '[class*="react-draggable"]',
        '[class*="aliexpress"]',
        '[class*="amazon-assistant"]',
        '[class*="supplier"]',
        '[id*="extension"]',
        '[id*="supplier"]',
        'div[hidden]:not(script)',
        'div[style*="z-index: 999999"]',
        'div[style*="position: fixed"][style*="display: none"]',
      ];

      let removed = false;
      selectors.forEach(selector => {
        try {
          document.querySelectorAll(selector).forEach(el => {
            // Don't remove React root or Next.js elements
            if (el.id === '__next' || 
                el.id === 'root' || 
                el.tagName === 'SCRIPT' ||
                el.tagName === 'STYLE' ||
                el.closest('#__next')) {
              return;
            }
            el.remove();
            removed = true;
          });
        } catch (e) {
          // Invalid selector, ignore
        }
      });

      return removed;
    };

    // Run multiple times
    removeExtensionElements();
    setTimeout(removeExtensionElements, 0);
    setTimeout(removeExtensionElements, 100);
    setTimeout(removeExtensionElements, 500);

    // Also observe for late injections
    const observer = new MutationObserver((mutations) => {
      let shouldCleanup = false;
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            const el = node as Element;
            if (el.className && (
              String(el.className).includes('supplier') ||
              String(el.className).includes('react-draggable')
            )) {
              shouldCleanup = true;
            }
          }
        });
      });
      if (shouldCleanup) {
        removeExtensionElements();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return null;
}
