import { MESSAGES } from './messages.js';

// Pragmatic client-side regex (not RFC 5322): rejects obvious typos and
// accepts anything that could be an email. Real verification needs a round-trip.
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Returns an email validator. Empty values pass — compose with `required()`
 * when the field is mandatory.
 *
 * @param {string} [message]
 * @returns {(value: unknown) => string | null}
 */
export function email(message = MESSAGES.email) {
  return (value) => {
    if (value === null || value === undefined || value === '') return null;
    if (typeof value !== 'string') return message;
    return EMAIL_REGEX.test(value) ? null : message;
  };
}
