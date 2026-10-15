// Which markdown topics each learning tab renders. Component-driven
// sections (glossary, challenges) are not markdown and are not listed.
import { LearningTabName } from './config';

export const MARKDOWN_TOPICS: Record<LearningTabName, string[]> = {
  learn: ['how-it-works', 'guides', 'breaking-it'],
  history: ['history'],
  practice: [],
};

export const contentPath = (cipher: string, locale: string, topic: string): string =>
  `content/${cipher}/${locale}/${topic}.md`;
