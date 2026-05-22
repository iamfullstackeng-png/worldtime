import PropTypes from 'prop-types';
import { forwardRef } from 'react';

import { useMediaQuery } from '@/hooks';
import { MEDIA } from '@/styles/breakpoints.js';

import styles from './AuthLayout.module.css';

const cx = (...args) => args.filter(Boolean).join(' ');

const AuthLayout = forwardRef(function AuthLayout(
  { children, illustration = null, className = '', ...rest },
  ref,
) {
  const isDesktop = useMediaQuery(MEDIA.mdUp);
  const showIllustration = Boolean(illustration) && isDesktop;

  return (
    <div
      ref={ref}
      className={cx(styles.root, showIllustration ? styles.twoColumn : '', className)}
      {...rest}
    >
      <div className={styles.formColumn}>
        <div className={styles.formInner}>{children}</div>
      </div>
      {showIllustration && <div className={styles.illustrationColumn}>{illustration}</div>}
    </div>
  );
});

AuthLayout.propTypes = {
  children: PropTypes.node.isRequired,
  illustration: PropTypes.node,
  className: PropTypes.string,
};

AuthLayout.defaultProps = {
  illustration: null,
  className: '',
};

AuthLayout.displayName = 'AuthLayout';

export default AuthLayout;
