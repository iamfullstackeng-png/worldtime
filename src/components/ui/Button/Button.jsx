import PropTypes from 'prop-types';
import { forwardRef } from 'react';

import { Spinner } from '../Spinner/index.js';

import styles from './Button.module.css';

const cx = (...args) => args.filter(Boolean).join(' ');

const Button = forwardRef(function Button(
  {
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    isLoading = false,
    leftIcon = null,
    rightIcon = null,
    type = 'button',
    disabled = false,
    className = '',
    children,
    ...rest
  },
  ref,
) {
  const classes = cx(
    styles.root,
    styles[variant],
    styles[size],
    fullWidth ? styles.fullWidth : '',
    className,
  );

  return (
    <button
      ref={ref}
      type={type}
      className={classes}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      {...rest}
    >
      {isLoading ? (
        <Spinner size="sm" inline label="Loading" />
      ) : (
        leftIcon && <span className={styles.icon}>{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className={styles.icon}>{rightIcon}</span>}
    </button>
  );
});

Button.propTypes = {
  variant: PropTypes.oneOf(['primary', 'secondary', 'ghost']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  fullWidth: PropTypes.bool,
  isLoading: PropTypes.bool,
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  disabled: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

Button.defaultProps = {
  variant: 'primary',
  size: 'md',
  fullWidth: false,
  isLoading: false,
  leftIcon: null,
  rightIcon: null,
  type: 'button',
  disabled: false,
  className: '',
};

Button.displayName = 'Button';

export default Button;
