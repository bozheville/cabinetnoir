import { describe, expect, it } from 'vitest';

import fs from 'fs';
import path from 'path';

import { encodingsList, encryptorsList } from '../@encryptors/algorithms';
import reviewStatus from '../../content/review-status.json';
import reviewDates from '../../content/review-dates.json';
import { getHistoryReview, getReviewFlags } from './review';

const CIPHERS: string[] = [...encodingsList, ...encryptorsList];
const LOCALES = ['en', 'fr', 'ua'];
// Content pages that exist per cipher × locale in content/.
const PAGES = ['how-it-works', 'guides', 'breaking-it', 'history', 'tool'];

const asRecord = (value: unknown): Record<string, unknown> =>
  (value ?? {}) as Record<string, unknown>;

describe('review-status config', () => {
  it('only names real ciphers, pages and locales', () => {
    for (const [cipher, pages] of Object.entries(asRecord(reviewStatus))) {
      expect(CIPHERS).toContain(cipher);
      for (const [page, locales] of Object.entries(asRecord(pages))) {
        expect(PAGES).toContain(page);
        for (const locale of Object.keys(asRecord(locales))) {
          expect(LOCALES).toContain(locale);
        }
      }
    }
  });

  it('resolves the flags, treating unknown entries as unreviewed', () => {
    expect(getReviewFlags('caesar', 'history', 'en')).toEqual({
      reviewed: true,
      autoTranslated: false,
    });
    expect(getReviewFlags('caesar', 'history', 'fr')).toEqual({
      reviewed: false,
      autoTranslated: true,
    });
    // No entry: current layout, no claims.
    expect(getReviewFlags('vigenere', 'history', 'en')).toEqual({
      reviewed: false,
      autoTranslated: false,
    });
    // Unknown cipher / locale: safe fallback, never a crash.
    expect(getReviewFlags('nope', 'history', 'en')).toEqual({
      reviewed: false,
      autoTranslated: false,
    });
    expect(getReviewFlags('caesar', 'history', 'xx')).toEqual({
      reviewed: false,
      autoTranslated: false,
    });
  });

  it('computes git dates for reviewed pages, none for machine translations', () => {
    const en = getHistoryReview('caesar', 'en');
    expect(en.reviewed).toBe(true);
    expect(en.dateModified).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    expect(en.dateModifiedLabel).toBeTruthy();

    const fr = getHistoryReview('caesar', 'fr');
    expect(fr.autoTranslated).toBe(true);
    expect(fr.reviewed).toBe(false);
    expect(fr.datePublished).toBeNull();
    expect(fr.dateModified).toBeNull();

    // No entry at all: plain page, no dates to report.
    expect(getHistoryReview('vigenere', 'en')).toEqual({
      reviewed: false,
      autoTranslated: false,
      datePublished: null,
      dateModified: null,
      dateModifiedLabel: null,
    });
  });

  it('shipped dates cover every history.md (deploy builds have no git)', () => {
    const dates = reviewDates as Record<string, unknown>;
    for (const cipher of CIPHERS) {
      for (const locale of LOCALES) {
        const key = `content/${cipher}/${locale}/history.md`;
        // Only history pages that ship need a date entry, but every
        // existing history.md is listed so future flags never break.
        expect(fs.existsSync(path.join('content', cipher, locale, 'history.md'))).toBe(true);
        if (getReviewFlags(cipher, 'history', locale).reviewed) {
          expect(dates[key], `${key} missing from content/review-dates.json`).toEqual({
            first: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/),
            last: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/),
          });
        }
      }
    }
  });
});
