import { describe, expect, it } from 'vitest';

import { REGIONS } from '@/features/countries/countriesConstants.js';
import {
  selectFilteredCountries,
  selectHasMore,
  selectVisibleCountries,
} from '@/features/countries/countriesSelectors.js';

const sampleList = [
  { name: 'Pakistan', region: 'Asia', flag: 'pk.svg' },
  { name: 'Japan', region: 'Asia', flag: 'jp.svg' },
  { name: 'France', region: 'Europe', flag: 'fr.svg' },
  { name: 'Germany', region: 'Europe', flag: 'de.svg' },
  { name: 'Brazil', region: 'Americas', flag: 'br.svg' },
  { name: 'Antarctica', region: null, flag: 'aq.svg' },
];

function makeState({ list = sampleList, filter = REGIONS.ALL, visibleCount = 12 } = {}) {
  return { countries: { list, filter, visibleCount, status: 'succeeded', error: null } };
}

describe('countriesSelectors', () => {
  it('selectFilteredCountries returns the full list when filter is All', () => {
    expect(selectFilteredCountries(makeState({ filter: REGIONS.ALL }))).toHaveLength(
      sampleList.length,
    );
  });

  it('selectFilteredCountries returns only matching region', () => {
    const result = selectFilteredCountries(makeState({ filter: REGIONS.ASIA }));
    expect(result.map((c) => c.name)).toEqual(['Pakistan', 'Japan']);
  });

  it('selectFilteredCountries gracefully skips countries with a null region under a specific filter', () => {
    const result = selectFilteredCountries(makeState({ filter: REGIONS.EUROPE }));
    expect(result.map((c) => c.name)).toEqual(['France', 'Germany']);
  });

  it('selectVisibleCountries returns at most visibleCount items', () => {
    const result = selectVisibleCountries(makeState({ visibleCount: 2 }));
    expect(result).toHaveLength(2);
  });

  it('selectHasMore is true when more items remain', () => {
    expect(selectHasMore(makeState({ visibleCount: 3 }))).toBe(true);
  });

  it('selectHasMore is false when visibleCount >= filtered length', () => {
    expect(selectHasMore(makeState({ visibleCount: sampleList.length }))).toBe(false);
  });

  it('selectFilteredCountries memoizes against identical inputs', () => {
    const state = makeState({ filter: REGIONS.ASIA });
    const a = selectFilteredCountries(state);
    const b = selectFilteredCountries(state);
    expect(a).toBe(b);
  });
});
