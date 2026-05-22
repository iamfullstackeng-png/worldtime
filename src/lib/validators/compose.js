/**
 * Runs validators left-to-right and returns the first error encountered, or
 * null if all pass. Left-to-right means `compose(required(), email())` reads
 * as "first check it exists, then check it's an email."
 *
 * @param {...((value: unknown, context?: unknown) => string | null)} validators
 * @returns {(value: unknown, context?: unknown) => string | null}
 *
 * @example
 *   const v = compose(required(), email(), maxLength(100));
 *   v('');               // 'This field is required'
 *   v('not-an-email');   // 'Enter a valid email address'
 *   v('a@b.co');         // null
 */
export function compose(...validators) {
  return (value, context) => {
    for (const v of validators) {
      const result = v(value, context);
      if (result) return result;
    }
    return null;
  };
}

/**
 * Builds a `validate(values)` function compatible with useForm from a schema
 * mapping field names to validators (or composed validators).
 *
 * @param {Object<string, (value: unknown, context?: unknown) => string | null>} schema
 * @returns {(values: Object) => Object<string, string | null>}
 *
 * @example
 *   const validate = composeFields({
 *     email: compose(required(), email()),
 *     password: compose(required(), password()),
 *   });
 *   validate({ email: '', password: 'short' });
 *   // => { email: 'This field is required', password: 'Password must be at least 8 characters' }
 */
export function composeFields(schema) {
  const fields = Object.keys(schema);
  return (values = {}) => {
    const out = {};
    for (const field of fields) {
      out[field] = schema[field](values[field], values);
    }
    return out;
  };
}
