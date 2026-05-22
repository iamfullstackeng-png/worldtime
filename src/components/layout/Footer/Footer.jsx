import PropTypes from 'prop-types';
import { forwardRef } from 'react';

import { SocialIconButton } from '@/components/ui';

import styles from './Footer.module.css';

const cx = (...args) => args.filter(Boolean).join(' ');

const DEFAULT_SOCIALS = [
  { platform: 'facebook', href: '#', label: 'Facebook' },
  { platform: 'twitter', href: '#', label: 'Twitter' },
  { platform: 'linkedin', href: '#', label: 'LinkedIn' },
  { platform: 'youtube', href: '#', label: 'YouTube' },
];

const GLYPHS = {
  facebook: 'f',
  twitter: 't',
  linkedin: 'in',
  youtube: '▶',
};

const Footer = forwardRef(function Footer(
  {
    email = 'info@worldtimes.com',
    copyright = 'Copyright © 2026 worldtimes. All rights reserved.',
    socials = DEFAULT_SOCIALS,
    extra = null,
    className = '',
    ...rest
  },
  ref,
) {
  return (
    <footer ref={ref} className={cx(styles.root, className)} {...rest}>
      <div className={styles.inner}>
        <div className={styles.socials}>
          {socials.map((s) => (
            <SocialIconButton
              key={s.platform}
              href={s.href}
              aria-label={`Visit our ${s.label} page`}
            >
              <span aria-hidden="true">{GLYPHS[s.platform] || s.label.charAt(0)}</span>
            </SocialIconButton>
          ))}
        </div>
        <a className={styles.email} href={`mailto:${email}`}>
          {email}
        </a>
        <p className={styles.copyright}>{copyright}</p>
        {extra && <div className={styles.extra}>{extra}</div>}
      </div>
    </footer>
  );
});

Footer.propTypes = {
  email: PropTypes.string,
  copyright: PropTypes.string,
  socials: PropTypes.arrayOf(
    PropTypes.shape({
      platform: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ),
  extra: PropTypes.node,
  className: PropTypes.string,
};

Footer.defaultProps = {
  email: 'info@worldtimes.com',
  copyright: 'Copyright © 2026 worldtimes. All rights reserved.',
  socials: DEFAULT_SOCIALS,
  extra: null,
  className: '',
};

Footer.displayName = 'Footer';

export default Footer;
