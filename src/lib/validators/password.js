import { MESSAGES } from './messages.js';

// Explicit symbol allowlist. We avoid \W because \W's complement is \w =
// [A-Za-z0-9_], which (a) makes "_" a non-symbol, and (b) under the `u` flag
// includes Unicode letters in ways that produce surprising matches. Spelling
// the class out is boring and correct.
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
