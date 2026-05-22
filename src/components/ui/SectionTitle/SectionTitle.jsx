import PropTypes from 'prop-types';
import { forwardRef } from 'react';

import styles from './SectionTitle.module.css';

const cx = (...args) => args.filter(Boolean).join(' ');

const ALIGN_CLASS = {
  left: styles.alignLeft,
  center: styles.alignCenter,
  right: styles.alignRight,
};

const SIZE_CLASS = {
  md: styles.sizeMd,
  lg: styles.sizeLg,
};

const SectionTitle = forwardRef(function SectionTitle(
  {
    children,
    as: Tag = 'h2',
    rules = 'both',
    align = 'center',
    size = 'md',
    className = '',
    ...rest
  },
  ref,
) {
  const showLeft = rules === 'both' || rules === 'left';
  const showRight = rules === 'both' || rules === 'right';

  return (
    <Tag
      ref={ref}
      className={cx(styles.root, ALIGN_CLASS[align], SIZE_CLASS[size], className)}
      {...rest}
    >
      {showLeft && <span className={styles.rule} aria-hidden="true" />}
      <span className={styles.text}>{children}</span>
      {showRight && <span className={styles.rule} aria-hidden="true" />}
    </Tag>
  );
});

SectionTitle.propTypes = {
  children: PropTypes.node.isRequired,
  as: PropTypes.oneOf(['h1', 'h2', 'h3']),
  rules: PropTypes.oneOf(['none', 'both', 'left', 'right']),
  align: PropTypes.oneOf(['left', 'center', 'right']),
  size: PropTypes.oneOf(['md', 'lg']),
  className: PropTypes.string,
};

SectionTitle.defaultProps = {
  as: 'h2',
  rules: 'both',
  align: 'center',
  size: 'md',
  className: '',
};

SectionTitle.displayName = 'SectionTitle';

export default SectionTitle;
