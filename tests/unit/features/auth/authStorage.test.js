import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  STORAGE_KEY,
  clearSession,
  readSession,
  writeSession,
} from '@/features/auth/authStorage.js';

import {
  installSessionStorage,
  uninstallSessionStorage,
} from '../../../helpers/sessionStorageMock.js';

beforeEach(() => {
  installSessionStorage();
});

afterEach(() => {
  uninstallSessionStorage();
  vi.restoreAllMocks();
});

describe('authStorage', () => {
  it('readSession returns null when key is missing', () => {
    expect(readSession()).toBeNull();
  });

  it('readSession returns null on malformed JSON', () => {
    globalThis.sessionStorage.setItem(STORAGE_KEY, '{not-json');
    expect(readSession()).toBeNull();
  });

  it('readSession returns null when shape is wrong', () => {
    globalThis.sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ foo: 'bar' }));
    expect(readSession()).toBeNull();
  });

  it('readSession returns the parsed session when shape matches', () => {
    globalThis.sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ user: { email: 'a@b.co' } }));
    expect(readSession()).toEqual({ user: { email: 'a@b.co' } });
  });

  it('writeSession stores the JSON-serialized session', () => {
    writeSession({ user: { email: 'a@b.co' } });
    expect(globalThis.sessionStorage.getItem(STORAGE_KEY)).toBe(
      JSON.stringify({ user: { email: 'a@b.co' } }),
    );
  });

  it('writeSession does not throw when setItem throws', () => {
    vi.spyOn(globalThis.sessionStorage, 'setItem').mockImplementation(() => {
      throw new Error('quota');
    });
    expect(() => writeSession({ user: { email: 'a@b.co' } })).not.toThrow();
  });

  it('clearSession removes the key', () => {
    globalThis.sessionStorage.setItem(STORAGE_KEY, 'x');
    clearSession();
    expect(globalThis.sessionStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it('clearSession does not throw when removeItem throws', () => {
    vi.spyOn(globalThis.sessionStorage, 'removeItem').mockImplementation(() => {
      throw new Error('boom');
    });
    expect(() => clearSession()).not.toThrow();
  });
});
