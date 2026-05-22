import { MESSAGES } from './messages.js';

/**
 * Returns a validator that fails when the value is "absent".
 *
 * Empty means: null, undefined, '', whitespace-only string, empty array.
 * 0 and false are NOT empty — they're real values in plenty of fields
 * (counts that allow 0, booleans where false is a deliberate answer).
 *
 * @param {string} [message]
 * @returns {(value: unknown) => string | null}
 */
export function required(message = MESSAGES.required) {
  return (value) => {
    if (value === null || value === undefined) return message;
    if (typeof value === 'string' && value.trim() === '') return message;
    if (Array.isArray(value) && value.length === 0) return message;
    return null;
  };
}
