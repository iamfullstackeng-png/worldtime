// @vitest-environment jsdom
import { configureStore } from '@reduxjs/toolkit';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  installSessionStorage,
  uninstallSessionStorage,
} from '../../../helpers/sessionStorageMock.js';

vi.mock('@/features/auth/authStorage.js', () => ({
  STORAGE_KEY: 'tw_auth_v1',
  readSession: () => null,
  writeSession: () => {},
  clearSession: () => {},
}));

vi.mock('@/lib/api/index.js', () => ({
  getCountries: vi.fn(),
}));

const { getCountries } = await import('@/lib/api/index.js');
const { authReducer, login } = await import('@/features/auth/index.js');
const { countriesReducer } = await import('@/features/countries/index.js');
const { default: HomePage } = await import('@/pages/HomePage/HomePage.jsx');

function makeMockCountries() {
  const regions = ['Asia', 'Europe', 'Americas', 'Africa', 'Oceania'];
  return Array.from({ length: 30 }).map((_, i) => ({
    name: `Country ${String(i + 1).padStart(2, '0')}`,
    region: regions[i % regions.length],
    flag: `flag-${i + 1}.svg`,
  }));
}

function makeStore() {
  const store = configureStore({ reducer: { auth: authReducer, countries: countriesReducer } });
  store.dispatch(login({ email: 'test@test.com' }));
  return store;
}

function renderHome({ store = makeStore() } = {}) {
  return {
    store,
    ...render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <HomePage />
        </MemoryRouter>
      </Provider>,
    ),
  };
}

beforeEach(() => {
  installSessionStorage();
  vi.mocked(getCountries).mockReset();
  vi.mocked(getCountries).mockResolvedValue(makeMockCountries());
});

afterEach(() => {
  uninstallSessionStorage();
});

describe('HomePage', () => {
  it('renders the header with brand and the WELCOME banner', async () => {
    renderHome();
    expect(screen.getAllByText(/countries/i).length).toBeGreaterThan(0);
    expect(screen.getByRole('heading', { name: /welcome/i, level: 1 })).toBeInTheDocument();
  });

  it('renders the hero slider', () => {
    renderHome();
    // HeroAccentFrame is the easiest stable handle for the slider's presence.
    expect(screen.getByLabelText(/featured content/i)).toBeInTheDocument();
  });

  it('renders skeletons while loading, then real cards after fetch resolves', async () => {
    const { container } = renderHome();
    // Skeletons should be present synchronously after first render.
    expect(container.querySelector('[aria-busy="true"]')).not.toBeNull();

    await waitFor(() => {
      expect(screen.getByText('Country 01')).toBeInTheDocument();
    });
    expect(container.querySelector('[aria-busy="true"]')).toBeNull();
  });

  it('shows the error state with a Try again button when the fetch fails', async () => {
    vi.mocked(getCountries).mockReset();
    vi.mocked(getCountries).mockRejectedValueOnce(
      Object.assign(new Error('Network down'), { name: 'NetworkError' }),
    );
    renderHome();
    expect(await screen.findByRole('alert')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });

  it('clicking Try again re-dispatches the fetch and recovers', async () => {
    vi.mocked(getCountries).mockReset();
    vi.mocked(getCountries)
      .mockRejectedValueOnce(Object.assign(new Error('Network down'), { name: 'NetworkError' }))
      .mockResolvedValueOnce(makeMockCountries());

    renderHome();
    const tryAgain = await screen.findByRole('button', { name: /try again/i });
    await userEvent.setup().click(tryAgain);

    await waitFor(() => {
      expect(screen.getByText('Country 01')).toBeInTheDocument();
    });
  });

  it('clicking a filter updates the active region and resets the visible count', async () => {
    const { store } = renderHome();
    await screen.findByText('Country 01');

    const user = userEvent.setup();
    const asiaButton = within(screen.getByRole('banner')).getByRole('button', { name: /^asia$/i });
    await user.click(asiaButton);

    expect(store.getState().countries.filter).toBe('Asia');
    expect(store.getState().countries.visibleCount).toBe(12);
  });

  it('clicking Load more increments visibleCount by PAGE_SIZE', async () => {
    const { store } = renderHome();
    await screen.findByText('Country 01');

    const initial = store.getState().countries.visibleCount;
    const loadMore = screen.getByRole('button', { name: /load more/i });
    await userEvent.setup().click(loadMore);

    expect(store.getState().countries.visibleCount).toBe(initial + 12);
  });

  it('does not render Load more when hasMore is false', async () => {
    vi.mocked(getCountries).mockReset();
    vi.mocked(getCountries).mockResolvedValue([{ name: 'Solo', region: 'Asia', flag: 'solo.svg' }]);

    renderHome();
    await screen.findByText('Solo');
    expect(screen.queryByRole('button', { name: /load more/i })).not.toBeInTheDocument();
  });

  it('renders the empty state when a filter matches zero countries', async () => {
    vi.mocked(getCountries).mockReset();
    vi.mocked(getCountries).mockResolvedValue([
      { name: 'Only', region: 'Americas', flag: 'only.svg' },
    ]);

    renderHome();
    await screen.findByText('Only');

    const user = userEvent.setup();
    const asiaButton = within(screen.getByRole('banner')).getByRole('button', { name: /^asia$/i });
    await user.click(asiaButton);

    expect(screen.getByText(/no countries match the current filter/i)).toBeInTheDocument();
  });

  it('renders the footer with a Sign out button that logs the user out', async () => {
    const { store } = renderHome();
    await screen.findByText('Country 01');

    const signOut = screen.getByRole('button', { name: /sign out/i });
    await userEvent.setup().click(signOut);

    expect(store.getState().auth.isAuthenticated).toBe(false);
  });
});
