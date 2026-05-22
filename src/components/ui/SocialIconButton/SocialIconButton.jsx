import PropTypes from 'prop-types';
import { forwardRef } from 'react';

import styles from './SocialIconButton.module.css';

const cx = (...args) => args.filter(Boolean).join(' ');

const requireAriaLabel = (props, _propName, componentName) => {
  if (!props['aria-label'] || typeof props['aria-label'] !== 'string') {
    return new Error(`${componentName} requires a string \`aria-label\` prop for accessibility.`);
  }
  return null;
};

const SocialIconButton = forwardRef(function SocialIconButton(
  { href, className = '', children, ...rest },
  ref,
) {
  const classes = cx(styles.root, className);

  if (href) {
    return (
      <a ref={ref} href={href} className={classes} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <button ref={ref} type="button" className={classes} {...rest}>
      {children}
    </button>
  );
});

SocialIconButton.propTypes = {
  'aria-label': requireAriaLabel,
  href: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

SocialIconButton.defaultProps = {
  href: undefined,
  className: '',
};

SocialIconButton.displayName = 'SocialIconButton';

export default SocialIconButton;
