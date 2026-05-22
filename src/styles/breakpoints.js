export const BREAKPOINTS = Object.freeze({
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
});

export const MEDIA = Object.freeze({
  smUp: `(min-width: ${BREAKPOINTS.sm}px)`,
  mdUp: `(min-width: ${BREAKPOINTS.md}px)`,
  lgUp: `(min-width: ${BREAKPOINTS.lg}px)`,
  xlUp: `(min-width: ${BREAKPOINTS.xl}px)`,
  smDown: `(max-width: ${BREAKPOINTS.sm - 1}px)`,
  mdDown: `(max-width: ${BREAKPOINTS.md - 1}px)`,
  lgDown: `(max-width: ${BREAKPOINTS.lg - 1}px)`,
});
