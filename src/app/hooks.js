import { useDispatch, useSelector } from 'react-redux';

/**
 * Typed dispatch hook bound to the application store. Import this from `@/app`
 * everywhere in the app instead of `useDispatch` directly.
 *
 * @returns {import('./store.js').AppDispatch}
 */
export function useAppDispatch() {
  return useDispatch();
}

/**
 * Typed selector hook bound to the application root state.
 *
 * @template TSelected
 * @param {(state: import('./store.js').RootState) => TSelected} selector
 * @returns {TSelected}
 */
export function useAppSelector(selector) {
  return useSelector(selector);
}
