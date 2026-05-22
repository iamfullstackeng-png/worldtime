import { describe, expect, it } from 'vitest';

import { MESSAGES } from '@/lib/validators/messages.js';
import { required } from '@/lib/validators/required.js';

describe('required', () => {
  it('returns null for present values', () => {
    const v = required();
    expect(v('hello')).toBeNull();
    expect(v(0)).toBeNull();
    expect(v(false)).toBeNull();
    expect(v([1])).toBeNull();
  });

  it('returns the default message for absent values', () => {
    const v = required();
    expect(v(null)).toBe(MESSAGES.required);
    expect(v(undefined)).toBe(MESSAGES.required);
    expect(v('')).toBe(MESSAGES.required);
    expect(v('   ')).toBe(MESSAGES.required);
    expect(v([])).toBe(MESSAGES.required);
  });

  it('honors a custom message', () => {
    const v = required('You forgot this');
    expect(v('')).toBe('You forgot this');
    expect(v('ok')).toBeNull();
  });
});
