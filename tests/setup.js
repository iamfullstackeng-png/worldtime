import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// RTL's auto-cleanup only runs when Vitest globals are enabled. With explicit
// imports we wire it manually so DOM state doesn't leak between tests.
afterEach(() => {
  cleanup();
});

// jsdom does not implement matchMedia. react-bootstrap's Offcanvas (via
// @restart/hooks/useBreakpoint) calls it during render, so we shim it here.
if (typeof window !== 'undefined' && typeof window.matchMedia !== 'function') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query) => ({
      // Report desktop-sized viewport so layouts that branch on `min-width`
      // breakpoints (Header, AuthLayout) render their desktop variants in tests.
      matches: typeof query === 'string' && query.includes('min-width'),
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}
