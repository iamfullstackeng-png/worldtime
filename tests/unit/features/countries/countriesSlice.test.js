import { configureStore } from '@reduxjs/toolkit';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/api/index.js', () => ({
  getCountries: vi.fn(),
}));

const { getCountries } = await import('@/lib/api/index.js');
const {
  default: countriesReducer,
  fetchCountries,
  loadMore,
  resetCountries,
  setFilter,
} = await import('@/features/countries/countriesSlice.js');
const { PAGE_SIZE, REGIONS } = await import('@/features/countries/countriesConstants.js');

const initial = countriesReducer(undefined, { type: '@@INIT' });

beforeEach(() => {
  vi.mocked(getCountries).mockReset();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('countriesSlice (reducers)', () => {
  it('has the documented initial state', () => {
    expect(initial).toEqual({
      list: [],
      status: 'idle',
      error: null,
      filter: REGIONS.ALL,
      visibleCount: PAGE_SIZE,
    });
  });

  it('setFilter updates filter and resets visibleCount', () => {
    const start = { ...initial, visibleCount: 36 };
    const next = countriesReducer(start, setFilter(REGIONS.ASIA));
    expect(next.filter).toBe(REGIONS.ASIA);
    expect(next.visibleCount).toBe(PAGE_SIZE);
  });

  it('loadMore increments visibleCount by PAGE_SIZE', () => {
    const next = countriesReducer(initial, loadMore());
    expect(next.visibleCount).toBe(PAGE_SIZE * 2);
  });

  it('resetCountries returns to initial state', () => {
    const dirty = { ...initial, list: [{ name: 'X' }], filter: REGIONS.ASIA, visibleCount: 48 };
    expect(countriesReducer(dirty, resetCountries())).toEqual(initial);
  });
});

describe('countriesSlice (async thunk)', () => {
  function makeStore() {
    return configureStore({ reducer: { countries: countriesReducer } });
  }

  it('pending sets status: loading and clears error', () => {
    const start = { ...initial, error: 'old' };
    const next = countriesReducer(start, fetchCountries.pending('rid', undefined));
    expect(next.status).toBe('loading');
    expect(next.error).toBeNull();
  });

  it('fulfilled stores the payload', async () => {
    const payload = [{ name: 'Pakistan', region: 'Asia', flag: 'pk.svg' }];
    vi.mocked(getCountries).mockResolvedValueOnce(payload);

    const store = makeStore();
    await store.dispatch(fetchCountries());

    expect(store.getState().countries.status).toBe('succeeded');
    expect(store.getState().countries.list).toEqual(payload);
  });

  it('rejectWithValue payload becomes state.error', async () => {
    vi.mocked(getCountries).mockRejectedValueOnce(
      Object.assign(new Error('boom'), { name: 'ApiError' }),
    );

    const store = makeStore();
    await store.dispatch(fetchCountries());

    expect(store.getState().countries.status).toBe('failed');
    expect(store.getState().countries.error).toBe('boom');
  });

  it('falls back to action.error.message when payload is missing', () => {
    const action = {
      type: fetchCountries.rejected.type,
      payload: undefined,
      error: { message: 'native error' },
    };
    const next = countriesReducer(initial, action);
    expect(next.status).toBe('failed');
    expect(next.error).toBe('native error');
  });
});
