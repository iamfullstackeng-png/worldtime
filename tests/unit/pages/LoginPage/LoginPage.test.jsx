// @vitest-environment jsdom
import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  installSessionStorage,
  uninstallSessionStorage,
} from '../../../helpers/sessionStorageMock.js';

// Mock the persistence module so the slice doesn't try to hit real
// sessionStorage at module-eval time.
vi.mock('@/features/auth/authStorage.js', () => ({
  STORAGE_KEY: 'tw_auth_v1',
  readSession: () => null,
  writeSession: () => {},
  clearSession: () => {},
}));

// Spy on react-router-dom's useNavigate.
const navigateSpy = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => navigateSpy,
  };
});

const { authReducer, login } = await import('@/features/auth/index.js');
const { countriesReducer } = await import('@/features/countries/index.js');
const { default: LoginPage } = await import('@/pages/LoginPage/LoginPage.jsx');

function makeStore({ authed = false } = {}) {
  const store = configureStore({ reducer: { auth: authReducer, countries: countriesReducer } });
  if (authed) store.dispatch(login({ email: 'pre@authed.com' }));
  return store;
}

function renderLogin({ store = makeStore(), initialEntries = ['/login'] } = {}) {
  return {
    store,
    ...render(
      <Provider store={store}>
        <MemoryRouter initialEntries={initialEntries}>
          <LoginPage />
        </MemoryRouter>
      </Provider>,
    ),
  };
}

beforeEach(() => {
  installSessionStorage();
  navigateSpy.mockClear();
});

afterEach(() => {
  uninstallSessionStorage();
});

describe('LoginPage', () => {
  it('renders the page chrome', () => {
    renderLogin();
    expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/username or email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/keep me signed in/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/sign in with google/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/sign in with facebook/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/sign in with linkedin/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/sign in with twitter/i)).toBeInTheDocument();
  });

  it('surfaces both validation errors on empty submit', async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(screen.getByText(/username or email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('dispatches login and navigates home on valid submit', async () => {
    const user = userEvent.setup();
    const { store } = renderLogin();

    await user.type(screen.getByPlaceholderText(/username or email/i), 'user@test.com');
    await user.type(screen.getByPlaceholderText(/password/i), 'ValidPass1!');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(store.getState().auth.isAuthenticated).toBe(true);
    expect(store.getState().auth.user).toEqual({ email: 'user@test.com' });
    expect(navigateSpy).toHaveBeenCalledWith('/', { replace: true });
  });

  it('redirects to a deep-link target from location.state.from', async () => {
    const user = userEvent.setup();
    renderLogin({
      initialEntries: [{ pathname: '/login', state: { from: { pathname: '/somewhere' } } }],
    });

    await user.type(screen.getByPlaceholderText(/username or email/i), 'user@test.com');
    await user.type(screen.getByPlaceholderText(/password/i), 'ValidPass1!');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(navigateSpy).toHaveBeenCalledWith('/somewhere', { replace: true });
  });

  it('bounces an already-authenticated user to home on mount', () => {
    renderLogin({ store: makeStore({ authed: true }) });
    expect(navigateSpy).toHaveBeenCalledWith('/', { replace: true });
  });
});
