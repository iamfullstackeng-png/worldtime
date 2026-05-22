import { MESSAGES } from './messages.js';

/**
 * Returns a validator that fails when value.length < n. Empty values pass —
 * compose with `required()` when the field is mandatory.
 *
 * @param {number} n
 * @param {string} [message]
 * @returns {(value: unknown) => string | null}
 */
export function minLength(n, message) {
  const resolved = message ?? MESSAGES.minLength(n);
  return (value) => {
    if (value === null || value === undefined || value === '') return null;
    if (typeof value !== 'string') return resolved;
    return value.length < n ? resolved : null;
  };
}
