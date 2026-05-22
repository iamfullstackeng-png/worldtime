import PropTypes from 'prop-types';
import { forwardRef } from 'react';

import styles from './IconButton.module.css';

const cx = (...args) => args.filter(Boolean).join(' ');

const requireAriaLabel = (props, _propName, componentName) => {
  if (!props['aria-label'] || typeof props['aria-label'] !== 'string') {
    return new Error(`${componentName} requires a string \`aria-label\` prop for accessibility.`);
  }
  return null;
};

const IconButton = forwardRef(function IconButton(
  {
    size = 'md',
    variant = 'ghost',
    type = 'button',
    disabled = false,
    className = '',
    children,
    ...rest
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      className={cx(styles.root, styles[size], styles[variant], className)}
      {...rest}
    >
      {children}
    </button>
  );
});

IconButton.propTypes = {
  'aria-label': requireAriaLabel,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  variant: PropTypes.oneOf(['solid', 'ghost', 'outline']),
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  disabled: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

IconButton.defaultProps = {
  size: 'md',
  variant: 'ghost',
  type: 'button',
  disabled: false,
  className: '',
};

IconButton.displayName = 'IconButton';

export default IconButton;
