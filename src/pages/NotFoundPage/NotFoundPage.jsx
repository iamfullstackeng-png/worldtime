import { Link } from 'react-router-dom';

import { PATHS } from '@/routes/paths.js';

import styles from './NotFoundPage.module.css';

export default function NotFoundPage() {
  return (
    <main className={styles.root}>
      <h1 className={styles.code}>404</h1>
      <p className={styles.message}>This page does not exist.</p>
      <Link to={PATHS.HOME} className={styles.link}>
        Return home
      </Link>
    </main>
  );
}
