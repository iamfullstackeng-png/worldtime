import PropTypes from 'prop-types';
import { forwardRef } from 'react';

import styles from './Checkbox.module.css';

const cx = (...args) => args.filter(Boolean).join(' ');

const Checkbox = forwardRef(function Checkbox(
  { id, label, error = null, disabled = false, className = '', ...rest },
  ref,
) {
  const errorId = error ? `${id}-error` : null;

  return (
    <span className={cx(styles.wrapper, className)}>
      <label htmlFor={id} className={cx(styles.root, disabled ? styles.disabled : '')}>
        <input
          ref={ref}
          id={id}
          type="checkbox"
          disabled={disabled}
          className={cx(styles.input, error ? styles.error : '')}
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId || undefined}
          {...rest}
        />
        <span className={styles.label}>{label}</span>
      </label>
      {error && (
        <span id={errorId} className={styles.errorMessage}>
          {error}
        </span>
      )}
    </span>
  );
});

Checkbox.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

Checkbox.defaultProps = {
  error: null,
  disabled: false,
  className: '',
};

Checkbox.displayName = 'Checkbox';

export default Checkbox;
