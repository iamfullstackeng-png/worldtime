import { useSyncExternalStore } from 'react';

const noop = () => () => {};

function subscribe(query) {
  return (onChange) => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return noop();
    }
    const mql = window.matchMedia(query);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  };
}

function getSnapshot(query) {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return window.matchMedia(query).matches;
}

function getServerSnapshot() {
  return false;
}

export default function useMediaQuery(query) {
  return useSyncExternalStore(subscribe(query), () => getSnapshot(query), getServerSnapshot);
}
