import { isAnyOf } from '@reduxjs/toolkit';

import { startAppListening } from '@/app';

import { login, logout } from './authSlice.js';
import { clearSession, writeSession } from './authStorage.js';

startAppListening({
  matcher: isAnyOf(login),
  effect: (_action, listenerApi) => {
    const { user } = listenerApi.getState().auth;
    if (user) writeSession({ user });
  },
});

startAppListening({
  matcher: isAnyOf(logout),
  effect: () => {
    clearSession();
  },
});

/**
 * Importing this file registers the listeners by module side effect. Aggressive
 * bundlers may tree-shake side-effect-only modules; calling this function from
 * app startup forces the import (and therefore the registration) to stick.
 */
export const registerAuthListeners = () => {};
