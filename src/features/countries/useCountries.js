import { useCallback, useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '@/app';

import {
  selectCountriesError,
  selectCountriesStatus,
  selectFilter,
  selectFilteredTotal,
  selectHasMore,
  selectVisibleCountries,
} from './countriesSelectors.js';
import {
  fetchCountries,
  loadMore as loadMoreAction,
  setFilter as setFilterAction,
} from './countriesSlice.js';

/**
 * Page-level facade for the countries feature.
 *
 * @param {{ autoFetch?: boolean }} [options]
 * @returns {{
 *   countries: Array<{ name: string, region: string, flag: string }>,
 *   status: 'idle' | 'loading' | 'succeeded' | 'failed',
 *   error: string | null,
 *   filter: string,
 *   hasMore: boolean,
 *   total: number,
 *   setFilter: (region: string) => void,
 *   loadMore: () => void,
 *   refetch: () => void,
 * }}
 */
export function useCountries({ autoFetch = true } = {}) {
  const dispatch = useAppDispatch();

  const countries = useAppSelector(selectVisibleCountries);
  const status = useAppSelector(selectCountriesStatus);
  const error = useAppSelector(selectCountriesError);
  const filter = useAppSelector(selectFilter);
  const hasMore = useAppSelector(selectHasMore);
  const total = useAppSelector(selectFilteredTotal);

  const setFilter = useCallback((value) => dispatch(setFilterAction(value)), [dispatch]);
  const loadMore = useCallback(() => dispatch(loadMoreAction()), [dispatch]);
  const refetch = useCallback(() => dispatch(fetchCountries()), [dispatch]);

  useEffect(() => {
    if (autoFetch && status === 'idle') {
      dispatch(fetchCountries());
    }
  }, [autoFetch, status, dispatch]);

  return { countries, status, error, filter, hasMore, total, setFilter, loadMore, refetch };
}
