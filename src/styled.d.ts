// Augment styled-components' DefaultTheme with the app theme shape, so
// `theme.colors`, `theme.colorScheme` etc. are typed in styled components.
import theme from '@theme';

type AppTheme = typeof theme;

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends AppTheme {}
}
