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

// 60 countries: 30 Asia, 30 Europe. Enough to exercise pagination across both
// filters and verify the page-reset-on-filter-change rule from the spec.
function makeSixtyCountries() {
  const out = [];
  for (let i = 1; i <= 30; i += 1) {
    out.push({
      name: `Asia-${String(i).padStart(2, '0')}`,
      region: 'Asia',
      flag: `asia-${i}.svg`,
    });
  }
  for (let i = 1; i <= 30; i += 1) {
    out.push({
      name: `Europe-${String(i).padStart(2, '0')}`,
      region: 'Europe',
      flag: `europe-${i}.svg`,
    });
  }
  return out;
}

function makeStore() {
  const store = configureStore({ reducer: { auth: authReducer, countries: countriesReducer } });
  store.dispatch(login({ email: 'test@test.com' }));
  return store;
}

function renderHome() {
  const store = makeStore();
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
  vi.mocked(getCountries).mockResolvedValue(makeSixtyCountries());
});

afterEach(() => {
  uninstallSessionStorage();
});

describe('HomePage integration', () => {
  it('Load more → Load more → filter Asia resets pagination and filters cards', async () => {
    const { store } = renderHome();
    await screen.findByText('Asia-01');

    const user = userEvent.setup();

    // Two Load more clicks → 12 + 12 + 12 = 36 visible.
    const loadMore = () => screen.getByRole('button', { name: /load more/i });
    await user.click(loadMore());
    await waitFor(() => expect(store.getState().countries.visibleCount).toBe(24));
    await user.click(loadMore());
    await waitFor(() => expect(store.getState().countries.visibleCount).toBe(36));

    // Filter to Asia: visibleCount resets to PAGE_SIZE, visible cards are all Asia.
    const asiaButton = within(screen.getByRole('banner')).getByRole('button', { name: /^asia$/i });
    await user.click(asiaButton);

    await waitFor(() => {
      expect(store.getState().countries.filter).toBe('Asia');
      expect(store.getState().countries.visibleCount).toBe(12);
    });

    // Every visible heading should be an Asia card (12 of them).
    const headings = screen.getAllByRole('heading', { level: 3 });
    expect(headings).toHaveLength(12);
    headings.forEach((h) => {
      expect(h.textContent.startsWith('Asia-')).toBe(true);
    });
  });

  it('exposes a level-2 "Countries" landmark heading for screen readers', async () => {
    renderHome();
    await screen.findByText('Asia-01');

    const heading = screen.getByRole('heading', { level: 2, name: /countries/i });
    expect(heading).toBeInTheDocument();
  });
});
