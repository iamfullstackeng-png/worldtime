import PropTypes from 'prop-types';

import styles from './HeroAccentFrame.module.css';

const PlaceholderShape = () => (
  <svg viewBox="0 0 60 60" className={styles.placeholderSvg} aria-hidden="true">
    <polygon points="30,8 48,40 12,40" fill="currentColor" />
    <rect x="14" y="42" width="14" height="14" fill="currentColor" />
    <circle cx="42" cy="49" r="7" fill="currentColor" />
  </svg>
);

const HeroAccentFrame = ({ children = null }) => (
  <aside className={styles.root} aria-label="Featured content">
    {children ?? (
      <div className={styles.placeholder}>
        <PlaceholderShape />
      </div>
    )}
  </aside>
);

HeroAccentFrame.propTypes = {
  children: PropTypes.node,
};

HeroAccentFrame.displayName = 'HeroAccentFrame';

export default HeroAccentFrame;
