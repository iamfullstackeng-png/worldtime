// @vitest-environment jsdom
import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
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

vi.mock('@/lib/api/index.js', () => ({
  getCountries: vi.fn().mockResolvedValue([]),
}));

const { authReducer, login } = await import('@/features/auth/index.js');
const { countriesReducer } = await import('@/features/countries/index.js');
const { AppRoutes } = await import('@/routes/index.js');

function renderAt(path, { authed = false } = {}) {
  const store = configureStore({ reducer: { auth: authReducer, countries: countriesReducer } });
  if (authed) store.dispatch(login({ email: 'test@test.com' }));

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[path]}>
        <AppRoutes />
      </MemoryRouter>
    </Provider>,
  );
}

beforeEach(() => {
  installSessionStorage();
});

afterEach(() => {
  uninstallSessionStorage();
});

describe('AppRoutes', () => {
  it('renders the Login page at /login', () => {
    renderAt('/login');
    expect(screen.getByRole('heading', { name: /^sign in$/i })).toBeInTheDocument();
  });

  it('renders the Home page at / when authenticated', () => {
    renderAt('/', { authed: true });
    expect(screen.getByRole('heading', { name: /welcome/i, level: 1 })).toBeInTheDocument();
  });

  it('renders the 404 page at an unknown path', () => {
    renderAt('/no-such-route');
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText(/this page does not exist/i)).toBeInTheDocument();
  });

  it('redirects / to /login when not authenticated', () => {
    renderAt('/');
    expect(screen.getByRole('heading', { name: /^sign in$/i })).toBeInTheDocument();
  });
});
