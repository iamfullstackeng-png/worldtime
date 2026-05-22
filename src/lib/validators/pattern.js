import { MESSAGES } from './messages.js';

/**
 * Returns a validator that tests value against `regex`. Empty values pass.
 *
 * @param {RegExp} regex
 * @param {string} [message]
 * @returns {(value: unknown) => string | null}
 */
export function pattern(regex, message = MESSAGES.pattern) {
  return (value) => {
    if (value === null || value === undefined || value === '') return null;
    if (typeof value !== 'string') return message;
    return regex.test(value) ? null : message;
  };
}
