// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { HeroSlider } from '@/components';

const slides = [
  { id: 'a', src: 'a.png', alt: 'Slide A' },
  { id: 'b', src: 'b.png', alt: 'Slide B' },
  { id: 'c', src: 'c.png', alt: 'Slide C' },
];

describe('HeroSlider', () => {
  it('renders the carousel and the accent frame', () => {
    render(<HeroSlider slides={slides} />);
    expect(screen.getByLabelText(/featured content/i)).toBeInTheDocument();
    expect(screen.getAllByRole('img')).toHaveLength(slides.length);
  });

  it('renders one image per slide', () => {
    render(<HeroSlider slides={slides} />);
    expect(screen.getByAltText('Slide A')).toBeInTheDocument();
    expect(screen.getByAltText('Slide B')).toBeInTheDocument();
    expect(screen.getByAltText('Slide C')).toBeInTheDocument();
  });

  it('renders the default slides when no `slides` prop is passed', () => {
    render(<HeroSlider />);
    expect(screen.getAllByRole('img').length).toBeGreaterThan(0);
    expect(screen.getByAltText(/featured image 1/i)).toBeInTheDocument();
  });

  it('renders the accent placeholder when no `accentFrame` prop is passed', () => {
    const { container } = render(<HeroSlider slides={slides} />);
    expect(container.querySelector('aside svg')).not.toBeNull();
  });

  it('renders the accent frame children when `accentFrame` is passed', () => {
    render(<HeroSlider slides={slides} accentFrame={<div>Promotional content</div>} />);
    expect(screen.getByText('Promotional content')).toBeInTheDocument();
  });

  it('renders prev/next controls with accessible labels', () => {
    render(<HeroSlider slides={slides} />);
    // react-bootstrap renders the controls with a <span class="visually-hidden">
    // label of "Previous" / "Next" — find them by text content.
    expect(screen.getByText(/^previous$/i)).toBeInTheDocument();
    expect(screen.getByText(/^next$/i)).toBeInTheDocument();
  });

  it('renders one indicator per slide', () => {
    const { container } = render(<HeroSlider slides={slides} />);
    const indicators = container.querySelectorAll('.carousel-indicators button');
    expect(indicators.length).toBe(slides.length);
  });
});
