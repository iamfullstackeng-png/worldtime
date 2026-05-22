import { CountryCard, CountryCardSkeleton, HeroSlider } from '@/components';
import { AppLayout, Footer, Header } from '@/components/layout';
import { Button, SectionTitle } from '@/components/ui';
import { useAuth } from '@/features/auth';
import { REGION_OPTIONS, useCountries } from '@/features/countries';

import styles from './HomePage.module.css';

const SKELETON_COUNT = 12;

export default function HomePage() {
  const { logout } = useAuth();
  const { countries, status, error, filter, hasMore, setFilter, loadMore, refetch } =
    useCountries();

  const isLoading = status === 'loading' && countries.length === 0;
  const isError = status === 'failed';

  return (
    <AppLayout
      header={
        <Header
          brand="Countries"
          items={REGION_OPTIONS}
          activeValue={filter}
          onSelect={setFilter}
          extra={
            <button type="button" className={styles.signOutButton} onClick={logout}>
              Sign out
            </button>
          }
        />
      }
      footer={<Footer />}
    >
      <div className={styles.page}>
        <SectionTitle as="h1" rules="both" size="lg" className={styles.welcome}>
          Welcome
        </SectionTitle>

        <HeroSlider />

        <section className={styles.countriesSection} aria-labelledby="countries-heading">
          <h2 id="countries-heading" className="visually-hidden">
            Countries
          </h2>

          {isError && (
            <div role="alert" className={styles.errorState}>
              <p>{error || 'Failed to load countries.'}</p>
              <Button variant="secondary" onClick={refetch}>
                Try again
              </Button>
            </div>
          )}

          {isLoading && (
            <div className={styles.grid} aria-busy="true">
              {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                <CountryCardSkeleton key={`skeleton-${i}`} />
              ))}
            </div>
          )}

          {!isLoading && !isError && (
            <>
              <div className={styles.grid}>
                {countries.map((country) => (
                  <CountryCard key={`${country.name}-${country.region}`} country={country} />
                ))}
              </div>

              {countries.length === 0 && (
                <p className={styles.emptyState}>No countries match the current filter.</p>
              )}

              {hasMore && (
                <div className={styles.loadMoreWrap}>
                  <Button variant="primary" size="lg" onClick={loadMore}>
                    Load more
                  </Button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </AppLayout>
  );
}
