import PropTypes from 'prop-types';
import { useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';

import HeroAccentFrame from './HeroAccentFrame.jsx';
import HeroSlide from './HeroSlide.jsx';
import styles from './HeroSlider.module.css';

const cx = (...args) => args.filter(Boolean).join(' ');

const DEFAULT_SLIDES = [
  { id: 'slide-1', src: 'https://picsum.photos/seed/1/1200/600', alt: 'Featured image 1' },
  { id: 'slide-2', src: 'https://picsum.photos/seed/2/1200/600', alt: 'Featured image 2' },
  { id: 'slide-3', src: 'https://picsum.photos/seed/3/1200/600', alt: 'Featured image 3' },
  { id: 'slide-4', src: 'https://picsum.photos/seed/4/1200/600', alt: 'Featured image 4' },
];

/**
 * Hero composition shown on the home page. Single carousel (left, with arrows
 * and dots) alongside a static accent frame (right). The mockup shows two
 * adjacent frames with no controls on the right one — we read that as a
 * decorative panel, not a second carousel. The accent frame accepts arbitrary
 * children for future promotional content.
 *
 * Autoplay defaults off (WCAG 2.2.2 — Pause, Stop, Hide). Below the `md`
 * breakpoint the accent column is hidden, not stacked, so the carousel
 * doesn't get squeezed.
 */
const HeroSlider = ({
  slides = DEFAULT_SLIDES,
  autoplay = false,
  interval = 5000,
  accentFrame = null,
  className = '',
  ...rest
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className={cx(styles.root, className)} {...rest}>
      <div className={styles.primaryColumn}>
        <Carousel
          activeIndex={activeIndex}
          onSelect={setActiveIndex}
          interval={autoplay ? interval : null}
          indicators
          controls
          fade={false}
          className={styles.carousel}
        >
          {slides.map((slide) => (
            <Carousel.Item key={slide.id}>
              <HeroSlide src={slide.src} alt={slide.alt} />
            </Carousel.Item>
          ))}
        </Carousel>
      </div>

      <div className={styles.accentColumn}>
        <HeroAccentFrame>{accentFrame}</HeroAccentFrame>
      </div>
    </section>
  );
};

HeroSlider.propTypes = {
  slides: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      src: PropTypes.string.isRequired,
      alt: PropTypes.string.isRequired,
    }),
  ),
  autoplay: PropTypes.bool,
  interval: PropTypes.number,
  accentFrame: PropTypes.node,
  className: PropTypes.string,
};

HeroSlider.displayName = 'HeroSlider';

export default HeroSlider;
