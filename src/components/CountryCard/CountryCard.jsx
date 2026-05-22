import PropTypes from 'prop-types';
import { forwardRef } from 'react';

import styles from './CountryCard.module.css';

const cx = (...args) => args.filter(Boolean).join(' ');

// Hide a failed-to-load flag so the thumbnail's surface color shows through.
const hideOnError = (event) => {
  event.currentTarget.style.display = 'none';
};

const CountryCard = forwardRef(function CountryCard({ country, className = '', ...rest }, ref) {
  const { name, region, flag } = country;

  return (
    <article ref={ref} className={cx(styles.root, className)} {...rest}>
      <div className={styles.thumbnail}>
        <img
          src={flag}
          alt=""
          aria-hidden="true"
          className={styles.flag}
          loading="lazy"
          onError={hideOnError}
        />
      </div>
      <div className={styles.content}>
        <h3 className={styles.name}>{name}</h3>
        <p className={styles.region}>{region || 'Unknown region'}</p>
      </div>
    </article>
  );
});

CountryCard.propTypes = {
  country: PropTypes.shape({
    name: PropTypes.string.isRequired,
    region: PropTypes.string,
    flag: PropTypes.string.isRequired,
  }).isRequired,
  className: PropTypes.string,
};

CountryCard.defaultProps = {
  className: '',
};

CountryCard.displayName = 'CountryCard';

export default CountryCard;
