import PropTypes from 'prop-types';
import { forwardRef } from 'react';

import styles from './TextField.module.css';

const cx = (...args) => args.filter(Boolean).join(' ');

/**
 * `borderVariant` — `'subtle'` (default) uses `--color-border-subtle` for the
 * resting border; `'strong'` uses `--color-border` for high-contrast surfaces
 * like the Login page.
 */
const TextField = forwardRef(function TextField(
  {
    id,
    label,
    hideLabel = false,
    type = 'text',
    error = null,
    borderVariant = 'subtle',
    className = '',
    'aria-describedby': describedBy,
    ...rest
  },
  ref,
) {
  const errorId = error ? `${id}-error` : null;
  const describedByMerged = [describedBy, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={cx(styles.root, className)}>
      <label htmlFor={id} className={hideLabel ? 'visually-hidden' : styles.label}>
        {label}
      </label>
      <input
        ref={ref}
        id={id}
        type={type}
        className={cx(
          styles.input,
          borderVariant === 'strong' ? styles.inputStrong : '',
          error ? styles.error : '',
        )}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedByMerged}
        {...rest}
      />
      {error && (
        <span id={errorId} className={styles.errorMessage}>
          {error}
        </span>
      )}
    </div>
  );
});

TextField.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  hideLabel: PropTypes.bool,
  type: PropTypes.oneOf(['text', 'email', 'password', 'tel', 'url']),
  error: PropTypes.string,
  borderVariant: PropTypes.oneOf(['subtle', 'strong']),
  className: PropTypes.string,
  'aria-describedby': PropTypes.string,
};

TextField.defaultProps = {
  hideLabel: false,
  type: 'text',
  error: null,
  borderVariant: 'subtle',
  className: '',
  'aria-describedby': undefined,
};

TextField.displayName = 'TextField';

export default TextField;
