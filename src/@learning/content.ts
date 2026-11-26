// Which markdown topics each learning tab renders. Component-driven
// sections (glossary, challenges) are not markdown and are not listed.
import { LearningTabName } from './config';

export const MARKDOWN_TOPICS: Record<LearningTabName, string[]> = {
  learn: ['how-it-works', 'guides', 'breaking-it'],
  history: ['history'],
  practice: [],
};

// Markdown shown under the tool on the direct / reverse pages, always
// exposed as `learningContent.tool`. The decrypt page has its own copy
// (`tool-reverse.md`) so the two URLs are not near-duplicates; it falls
// back to `tool.md` when a cipher has none.
export const TOOL_TOPIC = 'tool';
export const TOOL_TOPIC_BY_ACTION: Record<string, string[]> = {
  direct: ['tool'],
  reverse: ['tool-reverse', 'tool'],
};

export const contentPath = (cipher: string, locale: string, topic: string): string =>
  `content/${cipher}/${locale}/${topic}.md`;
