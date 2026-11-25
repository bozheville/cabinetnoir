// Review status of hand-written content (tasks 06 + 12).
//
// Server-only: read from getStaticProps, never imported by a client
// component (the git child_process calls live here). Client components
// receive the resolved values as props.
//
// content/review-status.json is the single config for all pages:
//   <cipher> -> <page> -> <locale> -> { reviewed, autoTranslated }
// A missing entry means both flags false — the page keeps its current
// layout. `reviewed` marks a page the author has factually checked (it
// then gets the byline, the article layout and Article JSON-LD);
// `autoTranslated` marks a machine translation the author has not
// reviewed (the page says so).

import { execFileSync } from 'child_process';

import reviewStatus from '../../content/review-status.json';
import reviewDates from '../../content/review-dates.json';

export interface ReviewFlags {
  reviewed: boolean;
  autoTranslated: boolean;
}

export interface HistoryReviewInfo extends ReviewFlags {
  // W3C datetimes from git (committer date, like the sitemap lastmod);
  // null when git history is unavailable (shallow clone, no git).
  datePublished: string | null;
  dateModified: string | null;
  // Human date for the byline, formatted at build time so client
  // hydration never re-derives it (Intl output could differ there).
  dateModifiedLabel: string | null;
}

// The Ukrainian route prefix is /ua, but the language tag is `uk`.
const LANG_TAGS: Record<string, string> = { en: 'en', fr: 'fr', ua: 'uk' };

const data = reviewStatus as unknown as Record<
  string,
  Record<string, Record<string, ReviewFlags> | boolean>
>;

// Committed git dates (scripts/generate-content-dates.js), keyed by
// repo path. The deploy build (Cloudflare) has no usable git history,
// so this file is the primary source; live git is only a fallback for
// local development with fresh, not-yet-regenerated content.
const committedDates = reviewDates as Record<string, { first: string | null; last: string | null } | undefined>;

export const getReviewFlags = (
  cipher: string,
  page: string,
  locale: string
): ReviewFlags => {
  const entry = data?.[cipher]?.[page]?.[locale];
  return {
    reviewed: entry?.reviewed === true,
    autoTranslated: entry?.autoTranslated === true,
  };
};

const git = (args: string[]): string | null => {
  try {
    return execFileSync('git', args, {
      cwd: process.cwd(),
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim() || null;
  } catch {
    return null;
  }
};

// Same gate as scripts/generate-sitemap.js: a shallow clone may not
// reach the commits that matter, so dates are omitted rather than wrong.
const gitHistoryUsable = (): boolean =>
  git(['rev-parse', '--is-shallow-repository']) === 'false';

const historyDates = (
  cipher: string,
  locale: string
): { datePublished: string | null; dateModified: string | null } => {
  const file = `content/${cipher}/${locale}/history.md`;
  const committed = committedDates[file];
  if (committed?.last) {
    return { datePublished: committed.first ?? null, dateModified: committed.last };
  }
  if (!gitHistoryUsable()) {
    return { datePublished: null, dateModified: null };
  }
  const first = git(['log', '--reverse', '--format=%cI', '--', file]);
  return {
    datePublished: first ? first.split('\n')[0].trim() : null,
    dateModified: git(['log', '-1', '--format=%cI', '--', file]),
  };
};

// Review info for a history page. Dates and the human label are only
// computed for reviewed pages (the byline is the only consumer).
export const getHistoryReview = (
  cipher: string,
  locale: string
): HistoryReviewInfo => {
  const flags = getReviewFlags(cipher, 'history', locale);
  if (!flags.reviewed) {
    return {
      ...flags,
      datePublished: null,
      dateModified: null,
      dateModifiedLabel: null,
    };
  }

  const dates = historyDates(cipher, locale);
  const dateModifiedLabel = dates.dateModified
    ? new Intl.DateTimeFormat(LANG_TAGS[locale] || locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(dates.dateModified))
    : null;

  return { ...flags, ...dates, dateModifiedLabel };
};
