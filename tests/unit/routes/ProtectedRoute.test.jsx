// @vitest-environment jsdom
import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  installSessionStorage,
  uninstallSessionStorage,
} from '../../helpers/sessionStorageMock.js';

vi.mock('@/features/auth/authStorage.js', () => ({
  STORAGE_KEY: 'tw_auth_v1',
  readSession: () => null,
  writeSession: () => {},
  clearSession: () => {},
}));

const { authReducer, login } = await import('@/features/auth/index.js');
const { countriesReducer } = await import('@/features/countries/index.js');
const { default: ProtectedRoute } = await import('@/routes/ProtectedRoute.jsx');

function makeStore({ authed = false } = {}) {
  const store = configureStore({ reducer: { auth: authReducer, countries: countriesReducer } });
  if (authed) store.dispatch(login({ email: 'test@test.com' }));
  return store;
}

function LocationProbe() {
  const location = useLocation();
  return <div data-testid="probe">{JSON.stringify(location.state)}</div>;
}

beforeEach(() => {
  installSessionStorage();
});

afterEach(() => {
  uninstallSessionStorage();
});

describe('ProtectedRoute', () => {
  it('renders children when authenticated', () => {
    const store = makeStore({ authed: true });
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <div>Protected content</div>
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<div>Login screen</div>} />
          </Routes>
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByText('Protected content')).toBeInTheDocument();
  });

  it('redirects to /login when not authenticated', () => {
    const store = makeStore({ authed: false });
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <div>Protected content</div>
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<div>Login screen</div>} />
          </Routes>
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByText('Login screen')).toBeInTheDocument();
    expect(screen.queryByText('Protected content')).not.toBeInTheDocument();
  });

  it('passes the requested location in redirect state', () => {
    const store = makeStore({ authed: false });
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route
              path="/protected"
              element={
                <ProtectedRoute>
                  <div>Protected content</div>
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<LocationProbe />} />
          </Routes>
        </MemoryRouter>
      </Provider>,
    );

    const probe = screen.getByTestId('probe');
    const state = JSON.parse(probe.textContent);
    expect(state.from.pathname).toBe('/protected');
  });
});
