import breakpoints from './breakpoints';
import colorScheme from './legacy/color-scheme.json';
import * as legacyColors from './legacy/colors';
import { paddings } from './legacy/sizes';
import { leather, paper, metal, thread, desk } from './materials';
import { ink, data } from './ink';
import { zones } from './zones';
import { space, radius, shadow, widths } from './space';
import type from './type';

// New theme shape (specs/leather-deco-redesign/07-code-organisation.md).
// Legacy keys stay until the evergreen migration ends so nothing breaks.
const theme = {
  // materials
  leather,
  paper,
  metal,
  thread,
  desk,
  ink,
  data,
  zones,
  // layout tokens
  space,
  radius,
  shadow,
  widths,
  type,
  breakpoints,
  // legacy (remove with task 31)
  colors: legacyColors,
  colorScheme,
  paddings,
  borderRadius: {
    small: 4,
    default: 8,
  },
};

export default theme;
