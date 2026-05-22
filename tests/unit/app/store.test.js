import { describe, expect, it } from 'vitest';

import { store } from '@/app';

describe('store', () => {
  it('exposes the auth and countries slices', () => {
    const state = store.getState();
    expect(state).toHaveProperty('auth');
    expect(state).toHaveProperty('countries');
  });

  it('dispatch returns the action and does not throw', () => {
    const action = { type: 'audit/ping' };
    expect(() => store.dispatch(action)).not.toThrow();
    expect(store.dispatch(action)).toEqual(action);
  });

  it('exposes subscribe as a function', () => {
    expect(typeof store.subscribe).toBe('function');
  });
});
