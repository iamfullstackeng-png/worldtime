import PropTypes from 'prop-types';
import { forwardRef } from 'react';

import styles from './AppLayout.module.css';

const cx = (...args) => args.filter(Boolean).join(' ');

const AppLayout = forwardRef(function AppLayout(
  { header, footer, children, className = '', ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cx(styles.root, className)} {...rest}>
      {header}
      <main role="main" className={styles.main}>
        {children}
      </main>
      {footer}
    </div>
  );
});

AppLayout.propTypes = {
  header: PropTypes.node.isRequired,
  footer: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

AppLayout.defaultProps = {
  className: '',
};

AppLayout.displayName = 'AppLayout';

export default AppLayout;
