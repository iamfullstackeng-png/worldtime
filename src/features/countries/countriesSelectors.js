import { createSelector } from '@reduxjs/toolkit';

import { REGIONS } from './countriesConstants.js';

// Style choice: leaf selectors are plain arrows; only derived selectors are
// wrapped in createSelector. Identity reads don't need memoization, and
// createSelector accepts plain functions as inputs just fine.
const selectCountriesState = (state) => state.countries;

export const selectAllCountries = (state) => selectCountriesState(state).list;
export const selectCountriesStatus = (state) => selectCountriesState(state).status;
export const selectCountriesError = (state) => selectCountriesState(state).error;
export const selectFilter = (state) => selectCountriesState(state).filter;
export const selectVisibleCount = (state) => selectCountriesState(state).visibleCount;

export const selectFilteredCountries = createSelector(
  [selectAllCountries, selectFilter],
  (list, filter) => {
    if (filter === REGIONS.ALL) return list;
    return list.filter((c) => c?.region === filter);
  },
);

export const selectVisibleCountries = createSelector(
  [selectFilteredCountries, selectVisibleCount],
  (filtered, count) => filtered.slice(0, count),
);

export const selectHasMore = createSelector(
  [selectFilteredCountries, selectVisibleCount],
  (filtered, count) => count < filtered.length,
);

export const selectFilteredTotal = createSelector(
  [selectFilteredCountries],
  (filtered) => filtered.length,
);
