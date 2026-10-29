// Mobile-first breakpoints. Base styles target mobile; steps add columns.
// `small` is the old max-width alias, kept until migration ends.

const breakpoints = {
  tablet: '@media (min-width: 640px)',
  desktop: '@media (min-width: 1024px)',
  wide: '@media (min-width: 1360px)',
  // deprecated: kept so un-migrated styles keep working
  small: '@media (max-width: 640px)',
} as const;

export default breakpoints;
