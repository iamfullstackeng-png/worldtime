import { describe, expect, it } from 'vitest';

import { MESSAGES } from '@/lib/validators/messages.js';
import { minLength } from '@/lib/validators/minLength.js';

describe('minLength', () => {
  it('returns null when value meets the minimum', () => {
    const v = minLength(3);
    expect(v('abc')).toBeNull();
    expect(v('abcdef')).toBeNull();
  });

  it('returns the default message when too short', () => {
    const v = minLength(5);
    expect(v('abc')).toBe(MESSAGES.minLength(5));
  });

  it('returns null for empty value (composition contract)', () => {
    const v = minLength(3);
    expect(v('')).toBeNull();
    expect(v(null)).toBeNull();
    expect(v(undefined)).toBeNull();
  });

  it('honors a custom message', () => {
    const v = minLength(4, 'Too short');
    expect(v('abc')).toBe('Too short');
  });
});
