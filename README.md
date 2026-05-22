# worldtimes

A small React app that lists countries from the REST Countries API behind a login wall, with filtering, pagination, and a hero slider.

## Live demo

- **App:** [worldtime-ten.vercel.app](https://worldtime-ten.vercel.app/)
- **Design system gallery:** [worldtime-ten.vercel.app/system-design](https://worldtime-ten.vercel.app/system-design) — tokens, primitives, and composite components in one page

### Test credentials

| Email                       | Password    |
| --------------------------- | ----------- |
| `iamfullstackeng@gmail.com` | `Hello@123` |

Password rules: min 8 chars, 1 uppercase, 1 number, 1 symbol.

Architecture, layering, and notable decisions are documented in [System design](#system-design) below.

---

## Stack

React 19 · Vite 8 · Redux Toolkit · React Router · React-Bootstrap · Vitest · Cypress · Node 20.

## Quickstart

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # production bundle → dist/
npm run preview      # serve the production bundle locally
```

### Test

```bash
npm run test:run         # unit + integration (Vitest, 127 tests)
npm run test:coverage    # coverage report → ./coverage/
npm run e2e:ci           # Cypress happy-path against a live dev server
```

## System design

```text
src/
├── app/          # store, typed hooks, listener middleware
├── components/
│   ├── ui/       # primitives (Button, TextField, Checkbox, Spinner, …)
│   ├── layout/   # AppLayout, AuthLayout, Header, Footer
│   ├── CountryCard/
│   └── HeroSlider/
├── features/
│   ├── auth/        # slice, listeners (sessionStorage), useAuth
│   └── countries/   # slice, async thunk, selectors, useCountries
├── hooks/        # useForm, useDebounce, useMediaQuery
├── lib/
│   ├── api/      # fetch wrapper, typed errors, getCountries (v2→v3 fallback)
│   └── validators/
├── pages/        # LoginPage, HomePage, NotFoundPage
├── routes/       # AppRoutes, ProtectedRoute, PATHS
└── styles/       # tokens, breakpoints, bootstrap-overrides, globals
```

**Layered, one-way deps.** Pages compose features. Features own state. Components are presentational. Primitives never reach into features. `@/app` is the composition root.

**Tokens-only styling.** Every CSS value resolves to a token in `src/styles/tokens.css`. The design system lives there; components consume `var(--token)` exclusively.

**Auth.** Login dispatches to the auth slice; persistence lives in a listener middleware that writes `sessionStorage` on `login` and clears on `logout`. Reducers stay pure. The slice hydrates from storage at module load, so refreshes survive without flicker.

**Countries.** A single `createAsyncThunk` fetches the list once; filter + pagination are pure reducer transitions. `setFilter` atomically resets `visibleCount` so callers never have to remember to reset pagination on filter change. Visible-cards / has-more / total are derived in `createSelector`-memoized selectors.

**API.** Transport-only `request()` is the only module that calls `fetch`. It enforces a timeout, combines an external `AbortSignal` with the internal one (via `AbortSignal.any()`), and normalizes failures into `ApiError` / `NetworkError` / `TimeoutError`. `getCountries()` tries v2 first; on any `ApiError` it falls back to v3.1 with response-shape normalization, so callers always see `{ name, region, flag }`.

**Routing.** `BrowserRouter` with three routes: `/login` (public), `/` (protected via `<ProtectedRoute>`), `*` (404). The guard remembers the requested location in `state.from` so post-login redirects deep-link correctly.

**Testing.** Vitest + jsdom for unit and integration (validators, hooks, slices, components, page-level flows). Cypress runs one end-to-end spec that walks login → countries → filter → paginate → logout against the live REST Countries API.

## Notable decisions

- **JSDoc over TypeScript.** `RootState` and `AppDispatch` are typedef'd in `src/app/store.js` and surface as editor intellisense via `useAppDispatch` / `useAppSelector`.
- **`useForm` with reducer-backed state.** Single reducer for values / errors / touched / submitting. Errors are gated by `touched ∪ submit-attempt` so fields don't go red on the first keystroke.
- **Listener middleware for side effects.** Auth persistence lives there, not in the slice's reducers.
- **No-restricted-imports rule.** `useDispatch` / `useSelector` may only be imported in `src/app/hooks.js`; everywhere else uses the typed wrappers. Enforced by ESLint.
- **Tablet defaults to desktop.** Single `767px` breakpoint divides mobile from desktop+; 768–1023px renders the desktop layout.

## Scripts

| Script                  | Description                                       |
| ----------------------- | ------------------------------------------------- |
| `npm run dev`           | Vite dev server                                   |
| `npm run build`         | Production bundle → `dist/`                       |
| `npm run preview`       | Serve the production bundle locally               |
| `npm run lint`          | ESLint (zero-warning policy)                      |
| `npm run format`        | Prettier write                                    |
| `npm run format:check`  | Prettier check                                    |
| `npm run test:run`      | Vitest one-shot                                   |
| `npm run test:coverage` | Vitest with V8 coverage                           |
| `npm run e2e`           | Cypress headless (requires `npm run dev` running) |
| `npm run e2e:open`      | Cypress UI                                        |
| `npm run e2e:ci`        | Boots dev server, runs E2E, tears it down         |

## Deployment

Deployed on **Vercel**. [`vercel.json`](vercel.json) configures the Vite framework, build, output, and the SPA-fallback rewrite. `.npmrc` sets `legacy-peer-deps=true` so both local `npm ci` and Vercel's install step work without flags. No environment variables required.

## Known issues

- **macOS case-folding.** Do not introduce a `src/<alias>.jsx` whose name case-collides with an aliased directory (e.g. `src/App.jsx` alongside the `@/app` alias). On macOS's default case-insensitive filesystem the bundler resolves `@/app` to the `.jsx` file instead of the directory's `index.js`. The application root lives at `src/Root.jsx` for this reason.
