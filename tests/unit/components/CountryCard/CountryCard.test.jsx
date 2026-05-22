// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';

import { CountryCard } from '@/components';

const country = { name: 'Pakistan', region: 'Asia', flag: 'pk.svg' };

describe('CountryCard', () => {
  it('renders the name as a heading', () => {
    render(<CountryCard country={country} />);
    expect(screen.getByRole('heading', { name: 'Pakistan' })).toBeInTheDocument();
  });

  it('renders the region text', () => {
    render(<CountryCard country={country} />);
    expect(screen.getByText('Asia')).toBeInTheDocument();
  });

  it('renders the flag as a decorative image (empty alt, aria-hidden)', () => {
    const { container } = render(<CountryCard country={country} />);
    const img = container.querySelector('img');
    expect(img).not.toBeNull();
    expect(img.getAttribute('src')).toBe('pk.svg');
    expect(img.getAttribute('alt')).toBe('');
    expect(img.getAttribute('aria-hidden')).toBe('true');
    expect(img.getAttribute('loading')).toBe('lazy');
  });

  it('falls back to "Unknown region" when region is null', () => {
    render(<CountryCard country={{ ...country, region: null }} />);
    expect(screen.getByText(/unknown region/i)).toBeInTheDocument();
  });

  it('falls back to "Unknown region" when region is an empty string', () => {
    render(<CountryCard country={{ ...country, region: '' }} />);
    expect(screen.getByText(/unknown region/i)).toBeInTheDocument();
  });

  it('spreads rest props onto the root element', () => {
    render(<CountryCard country={country} data-testid="card" />);
    expect(screen.getByTestId('card')).toBeInTheDocument();
  });

  it('forwards the ref to the root <article>', () => {
    const ref = createRef();
    render(<CountryCard country={country} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current.tagName.toLowerCase()).toBe('article');
  });
});
