import { Link } from 'react-router-dom';

import { CountryCard, CountryCardSkeleton, HeroSlider } from '@/components';
import {
  Button,
  Checkbox,
  Divider,
  IconButton,
  SectionTitle,
  SocialIconButton,
  Spinner,
  TextField,
} from '@/components/ui';
import { PATHS } from '@/routes/paths.js';

import styles from './SystemDesignPage.module.css';

const COLOR_TOKENS = [
  '--color-bg',
  '--color-surface',
  '--color-surface-alt',
  '--color-border',
  '--color-border-subtle',
  '--color-text',
  '--color-text-muted',
  '--color-primary',
  '--color-primary-hover',
  '--color-link',
  '--color-link-hover',
  '--color-danger',
  '--color-danger-bg',
];

const SPACING_TOKENS = [
  '--space-1',
  '--space-2',
  '--space-3',
  '--space-4',
  '--space-5',
  '--space-6',
  '--space-7',
  '--space-8',
];

const RADIUS_TOKENS = ['--radius-sm', '--radius-md', '--radius-lg', '--radius-pill'];

const SHADOW_TOKENS = ['--shadow-sm', '--shadow-md', '--shadow-stacked'];

const TYPE_SAMPLES = [
  { token: '--font-size-3xl', label: 'Display 3xl' },
  { token: '--font-size-2xl', label: 'Display 2xl' },
  { token: '--font-size-xl', label: 'Heading xl' },
  { token: '--font-size-lg', label: 'Heading lg' },
  { token: '--font-size-md', label: 'Body md' },
  { token: '--font-size-sm', label: 'Body sm' },
  { token: '--font-size-xs', label: 'Caption xs' },
];

const PREVIEW_COUNTRY = {
  name: 'Pakistan',
  region: 'Asia',
  flag: 'https://flagcdn.com/pk.svg',
};

const PREVIEW_COUNTRY_2 = {
  name: 'France',
  region: 'Europe',
  flag: 'https://flagcdn.com/fr.svg',
};

export default function SystemDesignPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link to={PATHS.LOGIN} className={styles.backLink}>
          ← Back to login
        </Link>
        <h1 className={styles.title}>System design</h1>
        <p className={styles.lead}>
          A reference of the design tokens, primitives, and composite components that make up the
          application. Pages compose features, features own state, components stay presentational,
          primitives never reach into features. Every value below resolves to a token in{' '}
          <code>src/styles/tokens.css</code>.
        </p>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Color tokens</h2>
        <div className={styles.grid}>
          {COLOR_TOKENS.map((name) => (
            <div key={name} className={styles.tokenCard}>
              <div className={styles.swatch} style={{ backgroundColor: `var(${name})` }} />
              <p className={styles.tokenName}>{name}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Spacing</h2>
        <p className={styles.sectionLead}>4px base, t-shirt scale.</p>
        <div className={styles.grid}>
          {SPACING_TOKENS.map((name) => (
            <div key={name} className={styles.tokenCard}>
              <div className={styles.spacingBar} style={{ width: `var(${name})` }} />
              <p className={styles.tokenName}>{name}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Radius</h2>
        <div className={styles.grid}>
          {RADIUS_TOKENS.map((name) => (
            <div key={name} className={styles.tokenCard}>
              <div
                className={styles.swatch}
                style={{
                  backgroundColor: 'var(--color-surface-alt)',
                  borderRadius: `var(${name})`,
                }}
              />
              <p className={styles.tokenName}>{name}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Shadows</h2>
        <div className={styles.grid}>
          {SHADOW_TOKENS.map((name) => (
            <div key={name} className={styles.tokenCard}>
              <div className={styles.shadowBox} style={{ boxShadow: `var(${name})` }} />
              <p className={styles.tokenName}>{name}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Typography</h2>
        <div className={styles.col}>
          {TYPE_SAMPLES.map(({ token, label }) => (
            <div key={token}>
              <p className={styles.typeSample} style={{ fontSize: `var(${token})` }}>
                {label}
              </p>
              <p className={styles.tokenValue}>{token}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>UI primitives</h2>

        <p className={styles.subhead}>Button</p>
        <div className={styles.row}>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="primary" size="lg">
            Primary lg
          </Button>
          <Button variant="primary" isLoading>
            Loading
          </Button>
          <Button variant="primary" disabled>
            Disabled
          </Button>
        </div>

        <p className={styles.subhead}>TextField</p>
        <div className={styles.col}>
          <TextField id="sd-tf-1" label="Email" placeholder="you@example.com" />
          <TextField
            id="sd-tf-2"
            label="Email"
            placeholder="Email"
            hideLabel
            borderVariant="strong"
          />
          <TextField id="sd-tf-3" label="Password" type="password" placeholder="Password" />
          <TextField
            id="sd-tf-4"
            label="Email"
            placeholder="you@example.com"
            error="Enter a valid email address"
          />
        </div>

        <p className={styles.subhead}>Checkbox</p>
        <div className={styles.row}>
          <Checkbox id="sd-cb-1" label="Keep me signed in" />
          <Checkbox id="sd-cb-2" label="Checked" defaultChecked />
          <Checkbox id="sd-cb-3" label="Disabled" disabled />
        </div>

        <p className={styles.subhead}>IconButton</p>
        <div className={styles.row}>
          <IconButton aria-label="Settings" variant="ghost">
            ⚙
          </IconButton>
          <IconButton aria-label="Search" variant="outline">
            ⌕
          </IconButton>
          <IconButton aria-label="Confirm" variant="solid">
            ✓
          </IconButton>
        </div>

        <p className={styles.subhead}>SocialIconButton</p>
        <div className={styles.row}>
          <SocialIconButton aria-label="Sign in with Google" href="#">
            G
          </SocialIconButton>
          <SocialIconButton aria-label="Sign in with Facebook" href="#">
            f
          </SocialIconButton>
          <SocialIconButton aria-label="Sign in with LinkedIn" href="#">
            in
          </SocialIconButton>
          <SocialIconButton aria-label="Sign in with Twitter" href="#">
            t
          </SocialIconButton>
        </div>

        <p className={styles.subhead}>Spinner</p>
        <div className={styles.row}>
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
        </div>

        <p className={styles.subhead}>Divider</p>
        <Divider />
        <Divider label="Or Sign In With" />

        <p className={styles.subhead}>SectionTitle</p>
        <SectionTitle as="h3" size="md">
          Section title md
        </SectionTitle>
        <SectionTitle as="h3" size="lg">
          Section title lg
        </SectionTitle>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Composite components</h2>

        <p className={styles.subhead}>CountryCard</p>
        <div className={styles.cardGrid}>
          <CountryCard country={PREVIEW_COUNTRY} />
          <CountryCard country={PREVIEW_COUNTRY_2} />
          <CountryCardSkeleton />
          <CountryCardSkeleton />
        </div>

        <p className={styles.subhead}>HeroSlider</p>
        <HeroSlider />
      </section>
    </main>
  );
}
