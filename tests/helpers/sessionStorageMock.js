// In-memory sessionStorage shim for tests that mount the auth slice.
export function createSessionStorage() {
  const store = new Map();
  return {
    get length() {
      return store.size;
    },
    key(i) {
      return Array.from(store.keys())[i] ?? null;
    },
    getItem(k) {
      return store.has(k) ? store.get(k) : null;
    },
    setItem(k, v) {
      store.set(String(k), String(v));
    },
    removeItem(k) {
      store.delete(k);
    },
    clear() {
      store.clear();
    },
  };
}

export function installSessionStorage(initial = null) {
  const mock = createSessionStorage();
  if (initial !== null) mock.setItem('tw_auth_v1', initial);
  globalThis.sessionStorage = mock;
  return mock;
}

export function uninstallSessionStorage() {
  delete globalThis.sessionStorage;
}
