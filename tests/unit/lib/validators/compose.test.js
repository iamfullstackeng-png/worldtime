import { describe, expect, it } from 'vitest';

import { compose, composeFields } from '@/lib/validators/compose.js';
import { email } from '@/lib/validators/email.js';
import { MESSAGES } from '@/lib/validators/messages.js';
import { required } from '@/lib/validators/required.js';

describe('compose', () => {
  const v = compose(required(), email());

  it('returns the first failing validator message', () => {
    expect(v('')).toBe(MESSAGES.required);
    expect(v('not-an-email')).toBe(MESSAGES.email);
  });

  it('returns null when every validator passes', () => {
    expect(v('a@b.co')).toBeNull();
  });

  it('returns null when called with no validators', () => {
    expect(compose()('anything')).toBeNull();
  });
});

describe('composeFields', () => {
  const validate = composeFields({
    a: required(),
    b: required(),
  });

  it('returns an errors object with the same keys', () => {
    expect(validate({ a: 'x', b: '' })).toEqual({ a: null, b: MESSAGES.required });
  });

  it('handles missing values object', () => {
    expect(validate()).toEqual({ a: MESSAGES.required, b: MESSAGES.required });
  });
});
