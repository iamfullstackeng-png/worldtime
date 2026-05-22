import { useEffect, useState } from 'react';

/**
 * Debounce a value. Returns `value` after `delay` ms of stability.
 *
 * @param {*} value - The value to debounce.
 * @param {number} [delay=200] - Stability window in milliseconds. `0` returns value synchronously.
 * @returns {*} The debounced value.
 *
 * @example
 *   const [query, setQuery] = useState('');
 *   const debouncedQuery = useDebounce(query, 300);
 */
export function useDebounce(value, delay = 200) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    if (delay === 0) return undefined;
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return delay === 0 ? value : debounced;
}
