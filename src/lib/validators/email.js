import { MESSAGES } from './messages.js';

// Pragmatic client-side regex, not RFC 5322. A maximally-permissive regex catches
// edge cases real users send (plus-aliases, subdomains, etc.) but client-side
// email validation can only ever be a UX hint — the only correct way to confirm
// an address is to send a verification message. This pattern strikes the balance:
// reject obvious typos, accept anything that *could* be an email.
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
