import { MESSAGES } from './messages.js';

// Explicit allowlist instead of \W: underscore counts as a symbol, and \W
// pulls in Unicode letters under the `u` flag.
const SYMBOL_REGEX = /[!@#$%^&*(),.?":{}|<>_\-+=/\\[\];'`~]/;
const UPPER_REGEX = /[A-Z]/;
const NUMBER_REGEX = /[0-9]/;

/**
 * Returns a password complexity validator. Returns the FIRST failing rule's
 * message (not a concatenation) so users see one problem at a time.
 *
 * Rule order: length → upper → number → symbol.
 *
 * Empty values pass — compose with `required()` when mandatory.
 *
 * @param {{
 *   minLength?: number,
 *   requireUpper?: boolean,
 *   requireNumber?: boolean,
 *   requireSymbol?: boolean,
 * }} [options]
 * @param {{
 *   tooShort?: string,
 *   noUpper?: string,
 *   noNumber?: string,
 *   noSymbol?: string,
 * }} [messages]
 * @returns {(value: unknown) => string | null}
 */
export function password(options = {}, messages = MESSAGES.password) {
  const {
    minLength = 8,
    requireUpper = true,
    requireNumber = true,
    requireSymbol = true,
  } = options;

  return (value) => {
    if (value === null || value === undefined || value === '') return null;
    if (typeof value !== 'string') return messages.tooShort;

    if (value.length < minLength) return messages.tooShort;
    if (requireUpper && !UPPER_REGEX.test(value)) return messages.noUpper;
    if (requireNumber && !NUMBER_REGEX.test(value)) return messages.noNumber;
    if (requireSymbol && !SYMBOL_REGEX.test(value)) return messages.noSymbol;
    return null;
  };
}
