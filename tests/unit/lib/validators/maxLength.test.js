import { describe, expect, it } from 'vitest';

import { maxLength } from '@/lib/validators/maxLength.js';
import { MESSAGES } from '@/lib/validators/messages.js';

describe('maxLength', () => {
  it('returns null when value meets the maximum', () => {
    const v = maxLength(5);
    expect(v('abc')).toBeNull();
    expect(v('abcde')).toBeNull();
  });

  it('returns the default message when too long', () => {
    const v = maxLength(3);
    expect(v('abcd')).toBe(MESSAGES.maxLength(3));
  });

  it('returns null for empty value', () => {
    const v = maxLength(3);
    expect(v('')).toBeNull();
    expect(v(null)).toBeNull();
    expect(v(undefined)).toBeNull();
  });

  it('honors a custom message', () => {
    const v = maxLength(2, 'Too long');
    expect(v('abc')).toBe('Too long');
  });
});
