import { describe, expect, it } from 'vitest';

import { email } from '@/lib/validators/email.js';
import { MESSAGES } from '@/lib/validators/messages.js';

describe('email', () => {
  const v = email();

  it('accepts valid-looking emails', () => {
    expect(v('a@b.co')).toBeNull();
    expect(v('user+tag@example.com')).toBeNull();
    expect(v('a.b@sub.example.com')).toBeNull();
  });

  it('rejects obvious garbage', () => {
    expect(v('a')).toBe(MESSAGES.email);
    expect(v('a@')).toBe(MESSAGES.email);
    expect(v('@b')).toBe(MESSAGES.email);
    expect(v('a@b')).toBe(MESSAGES.email);
    expect(v('a b@c.d')).toBe(MESSAGES.email);
    expect(v('a@b.')).toBe(MESSAGES.email);
  });

  it('returns null for empty value (composition contract)', () => {
    expect(v('')).toBeNull();
    expect(v(null)).toBeNull();
    expect(v(undefined)).toBeNull();
  });

  it('honors a custom message', () => {
    const c = email('Bad email');
    expect(c('nope')).toBe('Bad email');
  });
});
