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
    document.body.setAttribute('data-extension-cleaned', 'true');
    document.documentElement.setAttribute('data-extension-cleaned', 'true');

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
            // Hide first, then remove
            (el as HTMLElement).style.display = 'none';
            (el as HTMLElement).style.visibility = 'hidden';
            el.remove();
            removed = true;
          });
        } catch (e) {
          // Invalid selector, ignore
        }
      });

      return removed;
    };

    // Run immediately and multiple times
    removeExtensionElements();
    const timeouts = [0, 10, 50, 100, 500, 1000].map(delay => 
      setTimeout(removeExtensionElements, delay)
    );

    // Also observe for late injections
    const observer = new MutationObserver((mutations) => {
      let shouldCleanup = false;
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            const el = node as Element;
            const className = String(el.className || '');
            const id = String(el.id || '');
            if (className.includes('supplier') ||
                className.includes('react-draggable') ||
                className.includes('draggable') ||
                id.includes('supplier')) {
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

    // Also observe head for extensions injecting there
    observer.observe(document.head, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      timeouts.forEach(clearTimeout);
    };
  }, []);

  return null;
}
