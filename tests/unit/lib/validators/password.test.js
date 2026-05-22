import { describe, expect, it } from 'vitest';

import { MESSAGES } from '@/lib/validators/messages.js';
import { password } from '@/lib/validators/password.js';

describe('password', () => {
  const v = password();

  it('fails on too short', () => {
    expect(v('Short1!')).toBe(MESSAGES.password.tooShort);
  });

  it('fails on missing uppercase', () => {
    expect(v('lowercase1!')).toBe(MESSAGES.password.noUpper);
  });

  it('fails on missing number', () => {
    expect(v('NoNumber!')).toBe(MESSAGES.password.noNumber);
  });

  it('fails on missing symbol', () => {
    expect(v('NoSymbol1')).toBe(MESSAGES.password.noSymbol);
  });

  it('returns null for a valid password', () => {
    expect(v('Valid1Pass!')).toBeNull();
  });

  it('returns null for empty value', () => {
    expect(v('')).toBeNull();
    expect(v(null)).toBeNull();
    expect(v(undefined)).toBeNull();
  });

  it('honors options and custom messages', () => {
    const c = password(
      { minLength: 4, requireSymbol: false },
      { ...MESSAGES.password, tooShort: 'Need 4+' },
    );
    expect(c('Ab1')).toBe('Need 4+');
    expect(c('Abc1')).toBeNull();
  });
});
