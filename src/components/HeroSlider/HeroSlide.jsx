import PropTypes from 'prop-types';

import styles from './HeroSlide.module.css';

const HeroSlide = ({ src, alt }) => (
  <div className={styles.root}>
    <img src={src} alt={alt} className={styles.image} loading="lazy" />
  </div>
);

HeroSlide.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
};

HeroSlide.displayName = 'HeroSlide';

export default HeroSlide;
