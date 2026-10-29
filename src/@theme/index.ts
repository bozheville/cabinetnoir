import breakpoints from './breakpoints';
import { leather, paper, metal, thread, desk } from './materials';
import { ink, data } from './ink';
import { zones } from './zones';
import { space, radius, shadow, widths } from './space';
import type from './type';

// Theme shape per specs/leather-deco-redesign/07-code-organisation.md.
// The pastel colorScheme ramps are retired with the redesign.
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
};

export default theme;
