import { useCallback } from 'react';

import { useAppDispatch, useAppSelector } from '@/app';

import { selectAuthStatus, selectCurrentUser, selectIsAuthenticated } from './authSelectors.js';
import { login as loginAction, logout as logoutAction } from './authSlice.js';

/**
 * Feature-local hook for components. The published surface of the auth feature;
 * pages and guards consume this instead of reaching into actions or selectors.
 *
 * @returns {{
 *   isAuthenticated: boolean,
 *   user: { email: string } | null,
 *   status: 'idle' | 'authenticating',
 *   login: (credentials: { email: string }) => void,
 *   logout: () => void,
 * }}
 */
export function useAuth() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectCurrentUser);
  const status = useAppSelector(selectAuthStatus);

  const login = useCallback((credentials) => dispatch(loginAction(credentials)), [dispatch]);

  const logout = useCallback(() => dispatch(logoutAction()), [dispatch]);

  return { isAuthenticated, user, status, login, logout };
}
