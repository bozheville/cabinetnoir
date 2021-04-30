import * as breakpoints from './breakpoints';
import colorScheme from './color-scheme.json';
import * as colors from './colors';
import { paddings } from './sizes';

const theme = {
  colors,
  colorScheme,
  breakpoints,
  paddings,
  borderRadius: {
    small: 4,
    default: 8,
  }
};

export default theme;
