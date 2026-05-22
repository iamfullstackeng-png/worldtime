import { configureStore } from '@reduxjs/toolkit';

import { authReducer } from '@/features/auth/index.js';
import { countriesReducer } from '@/features/countries/index.js';

import { listenerMiddleware } from './listenerMiddleware.js';

const rootReducer = {
  auth: authReducer,
  countries: countriesReducer,
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware),
  devTools: import.meta.env.DEV,
});

/**
 * @typedef {ReturnType<typeof store.getState>} RootState
 */

/**
 * @typedef {typeof store.dispatch} AppDispatch
 */
