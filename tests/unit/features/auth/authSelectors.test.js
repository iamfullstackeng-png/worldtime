import { describe, expect, it } from 'vitest';

import {
  selectAuthStatus,
  selectCurrentUser,
  selectIsAuthenticated,
} from '@/features/auth/authSelectors.js';

const state = {
  auth: {
    isAuthenticated: true,
    user: { email: 'a@b.co' },
    status: 'authenticating',
  },
};

describe('authSelectors', () => {
  it('selectIsAuthenticated returns auth.isAuthenticated', () => {
    expect(selectIsAuthenticated(state)).toBe(true);
  });

  it('selectCurrentUser returns auth.user', () => {
    expect(selectCurrentUser(state)).toEqual({ email: 'a@b.co' });
  });

  it('selectAuthStatus returns auth.status', () => {
    expect(selectAuthStatus(state)).toBe('authenticating');
  });
});
