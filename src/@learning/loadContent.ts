// Node-only content loader: reads learning markdown at build time
// (getStaticProps). Import it only inside getStaticProps via dynamic
// import - pulling `fs` into the client bundle breaks the build.
import fs from 'fs';
import path from 'path';

import { contentPath } from './content';

const readTopic = (cipher: string, locale: string, topic: string): string | null => {
  const file = path.join(process.cwd(), contentPath(cipher, locale, topic));
  if (!fs.existsSync(file)) {
    return null;
  }
  return fs.readFileSync(file, 'utf8');
};

// One markdown topic. Falls back to the `en` file when the locale file is
// missing (warns in dev); a missing `en` file means the topic is absent.
export const loadTopic = (cipher: string, locale: string, topic: string): string | null => {
  const localized = readTopic(cipher, locale, topic);
  if (localized !== null) {
    return localized;
  }

  if (locale !== 'en') {
    const fallback = readTopic(cipher, 'en', topic);
    if (fallback !== null && process.env.NODE_ENV !== 'production') {
      console.warn(`[learning] missing ${contentPath(cipher, locale, topic)}, falling back to en`);
    }
    return fallback;
  }

  return null;
};

// All markdown topics of a tab, present ones only.
export const loadTopicsForTab = (
  cipher: string,
  locale: string,
  topics: string[],
): Record<string, string> => {
  const result: Record<string, string> = {};
  for (const topic of topics) {
    const content = loadTopic(cipher, locale, topic);
    if (content !== null) {
      result[topic] = content;
    }
  }
  return result;
};
