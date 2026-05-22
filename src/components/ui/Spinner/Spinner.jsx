import PropTypes from 'prop-types';
import { forwardRef } from 'react';

import styles from './Spinner.module.css';

const Spinner = forwardRef(function Spinner(
  { size = 'md', label = 'Loading', inline = false, className = '', ...rest },
  ref,
) {
  const classes = [styles.root, styles[size], inline ? styles.inline : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <span ref={ref} className={classes} role="status" aria-live="polite" {...rest}>
      <span className="visually-hidden">{label}</span>
    </span>
  );
});

Spinner.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  label: PropTypes.string,
  inline: PropTypes.bool,
  className: PropTypes.string,
};

Spinner.defaultProps = {
  size: 'md',
  label: 'Loading',
  inline: false,
  className: '',
};

Spinner.displayName = 'Spinner';

export default Spinner;
