import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

beforeEach(() => {
  vi.resetModules();
});

afterEach(() => {
  vi.doUnmock('@/features/auth/authStorage.js');
  vi.restoreAllMocks();
});

async function importSlice({ persisted = null } = {}) {
  vi.doMock('@/features/auth/authStorage.js', () => ({
    STORAGE_KEY: 'tw_auth_v1',
    readSession: () => persisted,
    writeSession: () => {},
    clearSession: () => {},
  }));
  return await import('@/features/auth/authSlice.js');
}

describe('authSlice', () => {
  it('starts unauthenticated when no session is persisted', async () => {
    const { default: reducer } = await importSlice();
    expect(reducer(undefined, { type: '@@INIT' })).toEqual({
      isAuthenticated: false,
      user: null,
      status: 'idle',
    });
  });

  it('hydrates from a persisted session', async () => {
    const { default: reducer } = await importSlice({
      persisted: { user: { email: 'a@b.co' } },
    });
    expect(reducer(undefined, { type: '@@INIT' })).toEqual({
      isAuthenticated: true,
      user: { email: 'a@b.co' },
      status: 'idle',
    });
  });

  it('login transitions to authenticated with the email stored', async () => {
    const { default: reducer, login } = await importSlice();
    const next = reducer(undefined, login({ email: 'a@b.co' }));
    expect(next).toEqual({
      isAuthenticated: true,
      user: { email: 'a@b.co' },
      status: 'idle',
    });
  });

  it('logout resets to the unauthenticated initial state', async () => {
    const { default: reducer, login, logout } = await importSlice();
    const loggedIn = reducer(undefined, login({ email: 'a@b.co' }));
    const next = reducer(loggedIn, logout());
    expect(next).toEqual({ isAuthenticated: false, user: null, status: 'idle' });
  });

  it('setStatus updates only the status field', async () => {
    const { default: reducer, login, setStatus } = await importSlice();
    const loggedIn = reducer(undefined, login({ email: 'a@b.co' }));
    const next = reducer(loggedIn, setStatus('authenticating'));
    expect(next).toEqual({
      isAuthenticated: true,
      user: { email: 'a@b.co' },
      status: 'authenticating',
    });
  });
});
