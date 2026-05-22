import { describe, expect, it } from 'vitest';

import { MESSAGES } from '@/lib/validators/messages.js';
import { loginValidationSchema } from '@/pages/LoginPage/loginValidation.js';

describe('loginValidationSchema', () => {
  it('flags empty email with the custom required message', () => {
    const errs = loginValidationSchema({ email: '', password: 'ValidPass1!' });
    expect(errs.email).toBe('Username or email is required');
    expect(errs.password).toBeNull();
  });

  it('flags empty password with the custom required message', () => {
    const errs = loginValidationSchema({ email: 'a@b.co', password: '' });
    expect(errs.email).toBeNull();
    expect(errs.password).toBe('Password is required');
  });

  it('runs the project password validator after required', () => {
    const errs = loginValidationSchema({ email: 'a@b.co', password: 'short' });
    expect(errs.password).toBe(MESSAGES.password.tooShort);
  });

  it('returns no errors for valid input', () => {
    expect(loginValidationSchema({ email: 'a@b.co', password: 'ValidPass1!' })).toEqual({
      email: null,
      password: null,
    });
  });

  it('catches each password rule individually', () => {
    expect(loginValidationSchema({ email: 'a@b.co', password: 'Short1!' }).password).toBe(
      MESSAGES.password.tooShort,
    );
    expect(loginValidationSchema({ email: 'a@b.co', password: 'lowercase1!' }).password).toBe(
      MESSAGES.password.noUpper,
    );
    expect(loginValidationSchema({ email: 'a@b.co', password: 'NoNumber!' }).password).toBe(
      MESSAGES.password.noNumber,
    );
    expect(loginValidationSchema({ email: 'a@b.co', password: 'NoSymbol1' }).password).toBe(
      MESSAGES.password.noSymbol,
    );
  });

  it('does not apply email format rules (accepts usernames)', () => {
    expect(loginValidationSchema({ email: 'plainusername', password: 'ValidPass1!' })).toEqual({
      email: null,
      password: null,
    });
  });
});
