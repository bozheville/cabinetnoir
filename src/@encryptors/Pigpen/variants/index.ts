import { PigpenVariant } from './types';
import { masonic } from './masonic';
import { rosicrucian } from './rosicrucian';
import { templar } from './templar';

// Variant registry. Each variant is a pure data file with the same
// shape; new variants (and others listed in the spec) land as data only.
export const PIGPEN_VARIANTS: Record<string, PigpenVariant> = {
  masonic,
  rosicrucian,
  templar,
};

// Selector order: classic masonic first, as specced.
export const PIGPEN_VARIANT_IDS = ['masonic', 'rosicrucian', 'templar'];

export const DEFAULT_PIGPEN_VARIANT = 'masonic';

export const getPigpenVariant = (id: string): PigpenVariant =>
  PIGPEN_VARIANTS[id] || PIGPEN_VARIANTS[DEFAULT_PIGPEN_VARIANT];
