# worldtimes

React application scaffolded with Vite, Redux Toolkit, and React-Bootstrap.

## Live demo

> Replace this line with the deployed Vercel URL once published (e.g. `https://worldtimes.vercel.app`).

## Tech stack

- React 19 (JSX)
- Vite 8 — build tool and dev server
- Redux Toolkit + react-redux
- React Router 7
- React-Bootstrap 2 (`Carousel`, `Offcanvas`)
- Vitest + React Testing Library + Cypress
- Node 20 LTS (see `.nvmrc`)
- ESLint (flat config) + Prettier + EditorConfig

## Architecture

```text
src/
├── app/                    # Application shell: store, providers, root setup
├── components/
│   ├── ui/                 # Reusable presentational primitives (Button, TextField, etc.)
│   └── layout/             # Layout shells (AuthLayout, AppLayout, Header, Footer)
├── features/
│   ├── auth/               # Auth slice, selectors, hooks, feature-local components
│   └── countries/          # Countries slice, selectors, hooks, feature-local components
├── hooks/                  # Cross-cutting custom hooks (useForm, useMediaQuery, etc.)
├── lib/                    # Framework-agnostic utilities
│   ├── api/                # API client and resource adapters
│   └── validators/         # Composable validation functions
├── pages/                  # Route-level page compositions
├── routes/                 # Route configuration and guards
└── styles/                 # Design tokens and global styles
tests/
├── unit/                   # Vitest unit tests (mirrors src/ structure)
└── e2e/                    # Cypress E2E specs (added later)
```

`features/` owns domain state and logic, including slices, selectors, and feature-local components that are not reused elsewhere. `components/ui/` is presentational and domain-agnostic; nothing inside it knows about auth, countries, or any other feature. `components/layout/` composes UI primitives into page shells such as headers, footers, and route wrappers. `pages/` composes layouts and features into the concrete views referenced by the router. `lib/` holds framework-agnostic utilities: pure JavaScript that could be lifted into another project without modification. `hooks/` holds cross-cutting React hooks that are not tied to a single feature. `app/` is the composition root that wires the store, providers, and router together. Each directory exposes an `index.js` barrel so the public API surface of every module is explicit.

## Design system

### Tokens

All visual primitives are defined as CSS custom properties on `:root` in `src/styles/tokens.css`, grouped by category: color (neutrals, brand, accent), spacing (4px-based t-shirt scale), radius, shadow, typography (font family, weights, sizes, line heights, letter spacing), layout and breakpoints, motion (durations and easings), and z-index. Breakpoint values are mirrored in `src/styles/breakpoints.js` because CSS custom properties cannot be consumed inside `@media` queries; those two files are the single source of truth and must stay in sync. The rule is strict: no component hardcodes a color, spacing value, font size, breakpoint, radius, or shadow. If a value is missing, the token system gets extended; components consume `var(--token-name)` exclusively.

### Bootstrap integration

Bootstrap 5 provides the CSS reset, grid, and a baseline component theme. We do not edit anything under `node_modules/bootstrap/**`. Instead, `src/styles/bootstrap-overrides.css` remaps Bootstrap's own CSS custom properties (`--bs-primary`, `--bs-body-bg`, `--bs-body-color`, `--bs-border-color`, `--bs-font-sans-serif`, etc.) to our tokens so Bootstrap components inherit the design system automatically. Bootstrap's JavaScript bundle is not imported; interactivity comes from React-Bootstrap in later parts. Load order in `src/styles/index.css` is intentional: Bootstrap first, tokens second, overrides third, globals last.

### UI primitives

Reusable presentational components live in `src/components/ui/`. They are domain-agnostic, token-driven, ref-forwarding, and prop-spreading. Each primitive is colocated with its CSS Module and barrel; the folder-level `index.js` re-exports them as named exports so consumers write `import { Button, TextField } from '@/components/ui';`. Primitives must not import from `@/features/`, `@/pages/`, or `@/routes/`.

- **Button** — variant (`primary` / `secondary` / `ghost`), size, `fullWidth`, `isLoading`, `leftIcon`/`rightIcon`. Wraps a native `<button>` and forwards refs.
- **TextField** — composed label + input + error. `hideLabel` keeps the label accessible while matching placeholder-only mockups.
- **Checkbox** — token-styled square checkbox with label and optional error message.
- **IconButton** — square icon-only button. `aria-label` is required and enforced by a custom PropTypes validator.
- **SocialIconButton** — circular outlined button or anchor (when `href` is provided) for social sign-in glyphs. `aria-label` required.
- **Divider** — horizontal `<hr>` or labeled separator (the "Or Sign In With" pattern).
- **SectionTitle** — large uppercase heading with optional flanking 2px rules (the "WELCOME" banner pattern).
- **Spinner** — CSS-only accessible loading indicator that inherits `currentColor`.

### Composite components

Higher-level presentational compositions that aren't quite primitives live directly under `src/components/` (no `ui/` subfolder).

- **`HeroSlider`** — single `react-bootstrap` `Carousel` (left, ~⅔ width) alongside a static `HeroAccentFrame` (right, ~⅓ width). Arrows + dot indicators are themed to project tokens via scoped CSS-Module overrides. Autoplay is off by default (WCAG 2.2.2). The accent column is hidden below the `md` breakpoint so the carousel doesn't get squeezed. A dev-only preview lives at `/__hero__` (tree-shaken from production builds).
- **`CountryCard`** — token-driven `<article>` with a flag thumbnail, country name, and region. Uses `--shadow-stacked` at rest with a lift-and-grow hover; truncates long names with an ellipsis; treats the flag image as decorative (empty `alt` + `aria-hidden`) so screen readers don't double-announce it; gracefully hides the image on load error and lets the thumbnail's surface color show through.
- **`CountryCardSkeleton`** — dimension-matched loading placeholder for `CountryCard`. Three shimmer bars (thumbnail + name + region) with a `prefers-reduced-motion` opt-out.

### Layouts

Layout shells live in `src/components/layout/` and compose UI primitives into responsive page chrome. Layouts own no domain knowledge; they receive nodes and render structure.

- **AuthLayout** — two-column auth chrome. Form on the left, optional illustration on the right. Below the `md` breakpoint the illustration is unmounted (not just `display:none`) via `useMediaQuery(MEDIA.mdUp)` so its node never enters the DOM on mobile.
- **AppLayout** — vertical flex column with `min-height: 100vh`. Takes `header`, `footer`, and `children` as separate slots; `<main>` flexes to push the footer to the bottom and centers content within `--container-max`.
- **Header** — sticky top bar. Desktop renders inline nav with an underlined active link; mobile renders a hamburger that opens a react-bootstrap `Offcanvas` panel containing the same nav. Different DOM is rendered per breakpoint so the panel does not exist on desktop and the inline nav does not exist on mobile.
- **Footer** — centered three-row footer (social icons, mailto link, copyright). Socials default to Facebook / Twitter / LinkedIn / YouTube.

### Hooks

Cross-cutting custom hooks live in `src/hooks/` (single-file utilities, no subfolders) and are re-exported from the folder barrel. JSDoc on each hook is the contract; PropTypes does not apply here.

- **`useMediaQuery(query)`** — subscribes to a media query via `useSyncExternalStore`. Used by `AuthLayout` and `Header` to render different DOM per breakpoint, not just toggle CSS.
- **`useForm({ initialValues, validate })`** — generic form state, validation, blur/submit lifecycle, `isSubmitting` tracking, and stable callback identities. Errors are gated by `touched` / submit-attempt so fields don't go red on the first keystroke. Reducer-backed; returned object is memoized.
- **`useDebounce(value, delay = 200)`** — returns `value` after `delay` ms of stability; `delay === 0` returns synchronously; effect cleans up its timer on unmount and on prop changes.

The page-level facade for the countries slice lives at `@/features/countries/useCountries.js` (the Part 5 stub was removed when the real slice landed in Part 10) and is documented under "State management → Countries slice".

### Validation

Validators live in `src/lib/validators/` and are framework-agnostic: pure JS, no React, no DOM. Every validator obeys one contract:

```js
(value, context?) => string | null
```

`null` means valid, a string means invalid. Never `false`, never `undefined`, never an object. `useForm`'s `validate` callback consumes this shape directly; `composeFields` produces it for whole-form validation.

- **`required(message?)`** — fails on `null`, `undefined`, `''`, whitespace-only strings, and empty arrays. `0` and `false` are valid.
- **`email(message?)`** — pragmatic regex (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`); empty values pass for composition.
- **`minLength(n, message?)`** / **`maxLength(n, message?)`** — string length bounds; empty values pass.
- **`pattern(regex, message?)`** — generic regex check; empty values pass.
- **`password(options?, messages?)`** — minimum length + upper + number + symbol, checked in that order; returns the first failing rule's message so users can fix one thing at a time.
- **`compose(...validators)`** — runs validators left-to-right, returns the first error or `null`.
- **`composeFields(schema)`** — builds a `validate(values) => { field: errorOrNull }` function compatible with `useForm`.
- **`MESSAGES`** — frozen object of default error copy; a future i18n layer can swap this file without touching individual validators.

Composition example:

```js
import { compose, composeFields, email, password, required } from '@/lib/validators';

const validate = composeFields({
  email: compose(required(), email()),
  password: compose(required(), password()),
});
```

### API layer

Network access is centralized in `src/lib/api/`. Callers depend on resource adapters (e.g. `getCountries`), never on `fetch` directly. The client is the only module in the codebase that calls `fetch`; everything above it sees one normalized shape and one typed error envelope.

- **`request(url, options)`** — transport-only `fetch` wrapper. Enforces a per-request timeout via `AbortController`, combines the internal timeout signal with any caller-supplied `signal` (preferring `AbortSignal.any()` where available), serializes plain-object bodies to JSON, and normalizes failures into typed errors.
- **`ApiError` / `NetworkError` / `TimeoutError`** — error hierarchy. `NetworkError` covers any failure where no usable response arrived (offline, DNS, etc.). `TimeoutError` extends `NetworkError` so a caller can either treat timeouts as a network failure or distinguish them via `instanceof TimeoutError`. `ApiError` carries the HTTP `status`.
- **`getCountries({ signal })`** — resource adapter. Tries the v2 endpoint first, falls back to v3.1 if v2 raises any `ApiError`, and normalizes both shapes to `Array<{ name, region, flag }>` so consumers never see the wire format. Forwards `signal` to both calls so cancellation propagates from upstream thunks.
- **`ENDPOINTS`** — frozen URL constants. The single file to edit if the host moves.

### State management

Redux Toolkit + `react-redux` provide state and side-effect orchestration. `src/app/` is the composition root and exposes a tiny, opinionated surface; domain slices live under `src/features/*/` and are added to the root reducer as they ship.

- **`store`** — `configureStore` instance. DevTools enabled only when `import.meta.env.DEV` is true. The listener middleware is prepended (not appended) per Redux Toolkit's documented guidance.
- **`useAppDispatch` / `useAppSelector`** — typed wrappers (JSDoc) around `useDispatch` / `useSelector`. Components must import these from `@/app`, never the raw hooks from `react-redux`. ESLint enforces this with a `no-restricted-imports` rule; only `src/app/hooks.js` is allowed to import the originals.
- **`startAppListening` / `stopAppListening`** — the side-effect channel. Slices that need to react to actions (auth persistence, analytics, toasts) register listeners against this middleware instead of writing custom middleware per slice.

#### Countries slice

State is `{ list, status, error, filter, visibleCount }`. The full country list is fetched once via `createAsyncThunk` (forwarding `signal` so duplicate dispatches abort) and stored unfiltered; the filtered and paginated view is derived in `createSelector`-memoized selectors. Filter changes and pagination reset are a _single_ state transition: `setFilter` updates `filter` and resets `visibleCount` to `PAGE_SIZE` in the same reducer, so callers never have to remember to reset pagination after switching regions. `useCountries()` is the published facade. It auto-fetches when `status === 'idle'`, exposes `setFilter`, `loadMore`, and `refetch`, and never lets consumers reach past it into raw actions or selectors. Regions are constants in `countriesConstants.js`; `PAGE_SIZE = 12` lives there too. The leaf selectors are plain arrow functions and the derived selectors (`selectFilteredCountries`, `selectVisibleCountries`, `selectHasMore`, `selectFilteredTotal`) are `createSelector`-memoized so subscribers don't re-render on every dispatch.

#### Auth slice

State is a flat three-field shape: `{ isAuthenticated, user, status }` where `user` is `{ email } | null` and `status` is `'idle' | 'authenticating'`. The slice owns its own hydration: `initialState` calls `readSession()` at module load, so the store stays unaware of persistence. Components consume the slice through `useAuth()`, which returns `{ isAuthenticated, user, status, login, logout }`. Persistence runs through the listener middleware in `authListeners.js`: a `login` action triggers a `writeSession` and a `logout` triggers a `clearSession`, both via the versioned `sessionStorage` key `tw_auth_v1` in `authStorage.js`, which is the only module in the codebase that touches `sessionStorage`. Bumping the version key (`_v2`) is the migration story; reducer purity is preserved because the side effect lives in the middleware.

### Pages

#### HomePage

`HomePage` is the authenticated experience. It composes `AppLayout` (with `Header` + `Footer`) around a `SectionTitle` WELCOME banner, the `HeroSlider`, and a 2-column responsive grid of `CountryCard` instances. Data, filter, and pagination state come from `useCountries`; the page itself owns no business logic. Filter clicks in the header dispatch `setFilter`, which the slice handles as a single atomic transition (region + reset to first page). The header's mobile Offcanvas closes on selection, so filter changes work the same way on mobile and desktop.

The page is a four-state machine: **loading** (initial fetch with no cached data; renders 12 `CountryCardSkeleton`s), **error** (renders a `role="alert"` with a "Try again" button that re-dispatches `fetchCountries`), **empty** (a successful fetch whose filter matches zero rows), and **success** (the grid plus a "Load more" button gated on `hasMore`). Refetches don't flash to skeletons if cards are already on screen, because the loading guard requires `countries.length === 0`. A small "Sign out" button lives in the footer via the `Footer`'s optional `extra` slot.

Visual fidelity matches the Figma desktop and mobile frames: WELCOME banner via `SectionTitle size="lg"` (3xl/2xl on desktop, 2xl/xl on mobile), token-driven vertical rhythm (`--space-7` for major separations, `--space-4` for grid gaps, `--space-6` for moderate gaps), 2-column grid on desktop collapsing to 1 column below `md`, and the "Load more" button at `Button size="lg"` matching the chunky CTA in the mockup.

#### LoginPage

`LoginPage` composes `AuthLayout` (two-column chrome with the illustration slot) with the project's primitives (`TextField`, `Checkbox`, `Button`, `Divider`, `SocialIconButton`), the `useForm` hook from `@/hooks`, and the `useAuth` facade from `@/features/auth`. There is no business logic in the file; the page is roughly 80 lines of composition. Where validation, persistence, or navigation happens is each in its own layer; the page is the wiring.

Validation rules live in `src/pages/LoginPage/loginValidation.js` as a `composeFields` schema so they are testable as a pure function without rendering the page. The email field requires presence only (it accepts a username OR an email per the mockup); the password field is `required` followed by the project `password()` validator, which surfaces the first failing rule of (length ≥ 8 → upper → number → symbol).

The page reads `location.state.from` set by `<ProtectedRoute>` and redirects there after successful login (falling back to `PATHS.HOME`), and includes an inverse guard: an already-authenticated user landing on `/login` is bounced back to home on mount, so direct URL hits and back-button traversals don't briefly show the form.

Visual fidelity matches the Figma desktop and mobile frames: a 40/60 form-vs-illustration split on desktop with the form vertically centered, single-column with the illustration unmounted below the `md` breakpoint. The page uses tokens exclusively: `--font-size-3xl` and `--letter-spacing-tight` on the title, `--space-4` rhythm between rows, `--color-border` (strong variant) on the inputs, `Button size="lg"` for the chunkier "Sign In" affordance, and a CSS-only illustration composition (two `--color-surface-alt` discs plus a key SVG in `--color-primary`).

### Routing

`react-router-dom` provides the URL ↔ component bridge. The route table lives in `src/routes/AppRoutes.jsx` and is rendered from `src/Root.jsx` inside a single `<BrowserRouter>` (HTML5 history; `vercel.json` rewrites cover direct-deeplinking in production).

- **Three routes:** `/login` (public), `/` (protected, wrapped in `<ProtectedRoute>`), `*` (catch-all `NotFoundPage`). The wildcard must stay last; a comment in `AppRoutes.jsx` warns against appending routes after it.
- **`<ProtectedRoute>`** redirects to `/login` with `replace` (keeps history clean) and `state.from = location` (deep-link target for post-login redirect; a latent capability the design doesn't yet exercise).
- **`PATHS`** in `src/routes/paths.js` is the single source of truth for path strings. `ROOT` and `HOME` are intentionally separate names for the same `/`.

## Testing

The project runs **Vitest** for unit and integration tests (~127 tests across validators, hooks, slices, components, pages, and end-to-end-shaped integration tests) and **Cypress** for a single browser-driven happy-path E2E spec.

### Unit / integration

Vitest is configured in `vite.config.js`. The default environment is `node`; tests that need a DOM declare `// @vitest-environment jsdom` at the top of the file. `tests/setup.js` wires `@testing-library/jest-dom` matchers, RTL `cleanup`, and a `matchMedia` shim that reports desktop sizing.

Coverage runs through `@vitest/coverage-v8` and reports `text` / `html` / `lcov`. Reports land in `./coverage/` (gitignored); open `coverage/index.html` to inspect line-by-line. Thresholds: 75% lines, 75% functions, 70% branches, 75% statements. Barrels, the routing root (`Root.jsx`), `main.jsx`, dev-only previews, and the mostly-SVG `HeroAccentFrame.jsx` are excluded with comments explaining each omission.

### E2E

Cypress is configured in `cypress.config.js`. `@testing-library/cypress` adds `cy.findByRole` / `cy.findByPlaceholderText` so the E2E queries match the unit-test query API. The single spec at `tests/e2e/happy-path.cy.js` walks the full user journey: rejects an invalid password, logs in, lists countries, paginates, filters by region (resetting pagination), filters back to All, and logs out.

The spec hits the real REST Countries API; this also exercises the v2 → v3 fallback in `src/lib/api/countriesApi.js`. Override the target URL with `CYPRESS_BASE_URL=https://your-deploy.example.com npm run e2e` to run the same spec against a deployed environment.

### Test scripts

| Script                  | Description                                                       |
| ----------------------- | ----------------------------------------------------------------- |
| `npm test`              | Vitest in interactive watch mode                                  |
| `npm run test:run`      | Vitest one-shot (CI-friendly)                                     |
| `npm run test:watch`    | Vitest explicit watch (alias for `npm test`)                      |
| `npm run test:coverage` | Vitest one-shot with V8 coverage                                  |
| `npm run e2e`           | Cypress headless run (requires `npm run dev` in another terminal) |
| `npm run e2e:open`      | Cypress interactive UI                                            |
| `npm run e2e:ci`        | Boots the dev server, runs E2E, tears it down                     |

## Deployment

This project is deployed to **Vercel**.

- **Configuration:** [`vercel.json`](vercel.json) at the project root pins the build command, output directory, framework, and the SPA-fallback rewrite (`/(.*) → /index.html`) so deep links like `/login` work after a hard refresh.
- **Peer-deps shim:** `.npmrc` sets `legacy-peer-deps=true` so both `npm ci` locally and Vercel's install step succeed without flags. Reason: `eslint-plugin-react` doesn't declare ESLint 9 in its peer range yet; we pin to ESLint 9 because `eslint-plugin-react` isn't ESLint-10-compatible either, so the `.npmrc` shim is the cleanest path.
- **Environment:** No environment variables required. The REST Countries endpoints are constants in [`src/lib/api/endpoints.js`](src/lib/api/endpoints.js).
- **Manual deploy:** `vercel` from the project root. First-time setup links the project; subsequent runs deploy a preview. `vercel --prod` promotes a deploy to production.

## Decisions and trade-offs

- **Layered architecture over feature-flat.** `features/`, `components/ui`, `components/layout`, `pages/`, `lib/`, `hooks/` enforce a one-way dependency graph: pages compose features; features own state; components are presentational; primitives never reach into features.
- **JSDoc over TypeScript.** Types weren't required for the scope of this project. JSDoc + PropTypes give editor intellisense and runtime checks without a TS migration. `RootState` and `AppDispatch` are documented as `@typedef` in `src/app/store.js` and consumed by `useAppDispatch` / `useAppSelector`.
- **v2 → v3.1 API fallback.** The REST Countries v2 endpoint has been intermittently unstable. `countriesApi.js` tries v2 first and falls back to v3.1 with response-shape normalization on any `ApiError`. The rest of the codebase sees only the v2 shape.
- **Typed error envelope.** `ApiError` / `NetworkError` / `TimeoutError` give callers `instanceof` distinctions for retry-vs-give-up logic. The transport-only `request()` wrapper is the _only_ module that calls `fetch`.
- **Tokens-only styling.** Every CSS value resolves to a token in `tokens.css`. Documented exceptions: 1px borders, 64×48 thumbnail dimensions (with a comment naming the future `--thumbnail-*` tokens and the trigger condition for promoting them).
- **React-Bootstrap Carousel with CSS theming.** Chosen over a custom carousel for accessibility (keyboard / ARIA) heavy-lift. Dot indicators and arrow icons are retheme'd via scoped CSS-Module overrides.
- **Listener middleware for side effects.** `sessionStorage` persistence for auth lives in `authListeners.js`, not in slice reducers. Reducers stay pure and replayable; persistence is a side effect on the listener channel.
- **`useForm` with reducer-backed state.** Single reducer manages `values`, `errors`, `touched`, `isSubmitting`, `submitAttempted`. Errors are gated by `touched ∪ submitAttempted` so fields don't go red on the first keystroke.
- **`SectionTitle` + `Button` size variants.** Both gained `size` props during page styling. `HomePage` uses `size="lg"` for the hero-banner WELCOME and the Load-more CTA; `LoginPage` uses `size="lg"` for the Sign-In button.
- **Logout in the footer.** The mockup doesn't show a logout affordance. The `Footer`'s optional `extra` slot keeps the layout extensible without putting a sign-out button in the header where it would compete with the filter tabs.
- **Tablet defaults to desktop.** The single `767px` breakpoint divides mobile from desktop+. Tablet portrait (768–1023px) renders the desktop variant; the mockup doesn't specify a tablet design.
- **Vitest + Cypress, single happy-path spec.** Unit / integration tests cover validators, hooks, slices, components, and page-level integration (127 tests). The Cypress spec is the one user-visible journey: login → list → paginate → filter → logout. The spec hits the live REST Countries API and exercises the v2 → v3 fallback in production conditions.
- **Test environments per-file via `// @vitest-environment jsdom`.** Default is `node`. The directive lives at the top of each file that needs a DOM, so future maintainers see it without consulting `vite.config.js`.

## Known issues

- **macOS case-folding gotcha.** Do not introduce a `src/<alias>.jsx` whose name case-collides with an aliased directory (e.g. a new `src/App.jsx` alongside the `@/app` alias). On macOS's default case-insensitive HFS+/APFS, the bundler resolves `@/app` to the `.jsx` file instead of the directory's `index.js`. The application root lives at `src/Root.jsx` for this reason.

### Typography

The application uses **Inter**, loaded from **Google Fonts** via a `<link>` in `index.html` with `display=swap` and `rel="preconnect"` hints for both `fonts.googleapis.com` and `fonts.gstatic.com`. Only four weights are loaded (`400` regular, `500` medium, `600` semibold, `700` bold) matching the `--font-weight-*` tokens. No other weights are pulled in, since the design system does not reference them.

## Path aliases

| Alias          | Resolves to      |
| -------------- | ---------------- |
| `@/`           | `src/`           |
| `@/app`        | `src/app`        |
| `@/components` | `src/components` |
| `@/features`   | `src/features`   |
| `@/hooks`      | `src/hooks`      |
| `@/lib`        | `src/lib`        |
| `@/pages`      | `src/pages`      |
| `@/routes`     | `src/routes`     |
| `@/styles`     | `src/styles`     |

Aliases are declared in both `vite.config.js` (for the bundler) and `jsconfig.json` (for editor intellisense).

## Getting started

Prerequisites: Node 20 LTS (see `.nvmrc`) and npm.

```sh
npm install
npm run dev      # start the dev server
npm run build    # production build to dist/
npm run preview  # preview the production build
```

## Scripts

| Script                 | Description                                 |
| ---------------------- | ------------------------------------------- |
| `npm run dev`          | Start the Vite dev server with HMR          |
| `npm run build`        | Build the production bundle to `dist/`      |
| `npm run preview`      | Preview the production bundle locally       |
| `npm run lint`         | Run ESLint with zero tolerance for warnings |
| `npm run lint:fix`     | Run ESLint and apply autofixes              |
| `npm run format`       | Format the repo with Prettier               |
| `npm run format:check` | Check formatting without writing changes    |

## Code quality

ESLint uses the flat config format (`eslint.config.js`) with `eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-jsx-a11y`, and `eslint-plugin-import`. React Hooks rules are enforced as errors. Import order is enforced and grouped by builtin / external / internal alias / parent / sibling / index, with blank lines between groups and alphabetical order within each group. Prettier owns formatting; `eslint-config-prettier` disables stylistic ESLint rules that would conflict. The `lint` script runs with `--max-warnings 0`, because warnings rot when they are tolerated.
