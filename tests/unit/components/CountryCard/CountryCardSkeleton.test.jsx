// @vitest-environment jsdom
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { CountryCardSkeleton } from '@/components';

describe('CountryCardSkeleton', () => {
  it('renders without crashing', () => {
    const { container } = render(<CountryCardSkeleton />);
    expect(container.firstChild).not.toBeNull();
  });

  it('marks the placeholder as aria-hidden', () => {
    const { container } = render(<CountryCardSkeleton />);
    expect(container.firstChild.getAttribute('aria-hidden')).toBe('true');
  });

  it('renders three placeholder bars (thumbnail + name + region)', () => {
    const { container } = render(<CountryCardSkeleton />);
    const bars = container.querySelectorAll('div > div, div > div > div');
    const allDivs = container.querySelectorAll('div');
    expect(allDivs.length).toBeGreaterThanOrEqual(5);
    expect(bars.length).toBeGreaterThanOrEqual(3);
  });
});
