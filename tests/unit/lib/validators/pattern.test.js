import { describe, expect, it } from 'vitest';

import { MESSAGES } from '@/lib/validators/messages.js';
import { pattern } from '@/lib/validators/pattern.js';

describe('pattern', () => {
  it('returns null when regex matches', () => {
    const v = pattern(/^[a-z]+$/);
    expect(v('abc')).toBeNull();
  });

  it('returns the default message when regex fails', () => {
    const v = pattern(/^[a-z]+$/);
    expect(v('ABC')).toBe(MESSAGES.pattern);
    expect(v('abc1')).toBe(MESSAGES.pattern);
  });

  it('returns null for empty value', () => {
    const v = pattern(/^[a-z]+$/);
    expect(v('')).toBeNull();
    expect(v(null)).toBeNull();
    expect(v(undefined)).toBeNull();
  });

  it('honors a custom message', () => {
    const v = pattern(/^\d+$/, 'Numbers only');
    expect(v('x')).toBe('Numbers only');
  });
});
