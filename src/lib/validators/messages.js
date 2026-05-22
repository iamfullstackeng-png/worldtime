export const MESSAGES = Object.freeze({
  required: 'This field is required',
  email: 'Enter a valid email address',
  minLength: (n) => `Must be at least ${n} characters`,
  maxLength: (n) => `Must be at most ${n} characters`,
  pattern: 'Invalid format',
  password: Object.freeze({
    tooShort: 'Password must be at least 8 characters',
    noUpper: 'Password must include an uppercase letter',
    noNumber: 'Password must include a number',
    noSymbol: 'Password must include a symbol',
  }),
});
