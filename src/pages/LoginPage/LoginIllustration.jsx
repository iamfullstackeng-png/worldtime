import styles from './LoginPage.module.css';

export default function LoginIllustration() {
  return (
    <div className={styles.illustration} aria-hidden="true">
      <div className={styles.illustrationDiscLarge} />
      <div className={styles.illustrationDiscSmall} />
      <svg
        className={styles.illustrationKey}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="22" cy="22" r="14" stroke="currentColor" strokeWidth="4" />
        <circle cx="22" cy="22" r="4" fill="currentColor" />
        <path
          d="M30 30 L54 54 M44 44 L50 38 M50 50 L56 44"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
