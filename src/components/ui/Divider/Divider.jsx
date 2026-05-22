import PropTypes from 'prop-types';
import { forwardRef } from 'react';

import styles from './Divider.module.css';

const cx = (...args) => args.filter(Boolean).join(' ');

const Divider = forwardRef(function Divider(
  { label = null, as, orientation = 'horizontal', className = '', ...rest },
  ref,
) {
  if (label) {
    return (
      <div
        ref={ref}
        role="separator"
        aria-orientation={orientation}
        className={cx(styles.labeled, className)}
        {...rest}
      >
        <span className={styles.line} aria-hidden="true" />
        <span className={styles.label}>{label}</span>
        <span className={styles.line} aria-hidden="true" />
      </div>
    );
  }

  const Tag = as || 'hr';
  const classes = cx(orientation === 'vertical' ? styles.vertical : styles.hr, className);

  return (
    <Tag
      ref={ref}
      className={classes}
      role={Tag === 'hr' ? undefined : 'separator'}
      aria-orientation={orientation}
      {...rest}
    />
  );
});

Divider.propTypes = {
  label: PropTypes.string,
  as: PropTypes.oneOf(['div', 'hr']),
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),
  className: PropTypes.string,
};

Divider.defaultProps = {
  label: null,
  as: undefined,
  orientation: 'horizontal',
  className: '',
};

Divider.displayName = 'Divider';

export default Divider;
