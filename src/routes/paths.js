// ROOT and HOME are intentionally the same value: "/" is both the application
// root that post-login redirects target and the home page consumers <Link> to.
// Keeping them as distinct names documents intent at call sites.
export const PATHS = Object.freeze({
  ROOT: '/',
  LOGIN: '/login',
  HOME: '/',
  NOT_FOUND: '*',
});
