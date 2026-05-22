import PropTypes from 'prop-types';

import styles from './CountryCardSkeleton.module.css';

const cx = (...args) => args.filter(Boolean).join(' ');

const CountryCardSkeleton = ({ className = '' }) => (
  <div className={cx(styles.root, className)} aria-hidden="true">
    <div className={cx(styles.bar, styles.thumbnail)} />
    <div className={styles.content}>
      <div className={cx(styles.bar, styles.nameBar)} />
      <div className={cx(styles.bar, styles.regionBar)} />
    </div>
  </div>
);

CountryCardSkeleton.propTypes = {
  className: PropTypes.string,
};

CountryCardSkeleton.defaultProps = {
  className: '',
};

CountryCardSkeleton.displayName = 'CountryCardSkeleton';

export default CountryCardSkeleton;
