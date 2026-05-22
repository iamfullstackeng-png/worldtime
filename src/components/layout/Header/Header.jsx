import PropTypes from 'prop-types';
import { forwardRef, useId, useRef, useState } from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';

import { IconButton } from '@/components/ui';
import { useMediaQuery } from '@/hooks';
import { MEDIA } from '@/styles/breakpoints.js';

import styles from './Header.module.css';

const cx = (...args) => args.filter(Boolean).join(' ');

const HamburgerGlyph = () => (
  <span className={styles.hamburgerIcon} aria-hidden="true">
    <span className={styles.hamburgerLine} />
    <span className={styles.hamburgerLine} />
    <span className={styles.hamburgerLine} />
  </span>
);

const itemShape = PropTypes.shape({
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
});

const Header = forwardRef(function Header(
  { brand = 'Countries', items, activeValue, onSelect, extra = null, className = '', ...rest },
  ref,
) {
  const isDesktop = useMediaQuery(MEDIA.mdUp);
  const [open, setOpen] = useState(false);
  const hamburgerRef = useRef(null);
  const panelId = useId();

  const handleSelect = (value) => {
    onSelect(value);
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
    if (hamburgerRef.current) {
      hamburgerRef.current.focus();
    }
  };

  return (
    <header ref={ref} className={cx(styles.root, className)} {...rest}>
      <div className={styles.inner}>
        <a href="#top" className={styles.brand}>
          {brand}
        </a>

        {isDesktop ? (
          <div className={styles.right}>
            <nav aria-label="Primary" className={styles.nav}>
              {items.map((item) => {
                const isActive = item.value === activeValue;
                return (
                  <button
                    key={item.value}
                    type="button"
                    className={cx(styles.link, isActive ? styles.linkActive : '')}
                    aria-current={isActive ? 'page' : undefined}
                    onClick={() => onSelect(item.value)}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>
            {extra && <div className={styles.extra}>{extra}</div>}
          </div>
        ) : (
          <>
            <IconButton
              ref={hamburgerRef}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => setOpen((v) => !v)}
            >
              <HamburgerGlyph />
            </IconButton>
            <Offcanvas
              id={panelId}
              show={open}
              onHide={handleClose}
              placement="end"
              aria-labelledby={`${panelId}-title`}
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id={`${panelId}-title`}>{brand}</Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <nav aria-label="Primary" className={styles.mobileNav}>
                  {items.map((item) => {
                    const isActive = item.value === activeValue;
                    return (
                      <button
                        key={item.value}
                        type="button"
                        className={cx(styles.mobileLink, isActive ? styles.mobileLinkActive : '')}
                        aria-current={isActive ? 'page' : undefined}
                        onClick={() => handleSelect(item.value)}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </nav>
                {extra && <div className={styles.mobileExtra}>{extra}</div>}
              </Offcanvas.Body>
            </Offcanvas>
          </>
        )}
      </div>
    </header>
  );
});

Header.propTypes = {
  brand: PropTypes.string,
  items: PropTypes.arrayOf(itemShape).isRequired,
  activeValue: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
  extra: PropTypes.node,
  className: PropTypes.string,
};

Header.defaultProps = {
  brand: 'Countries',
  extra: null,
  className: '',
};

Header.displayName = 'Header';

export default Header;
