// Placeholder registry: markdown may mark where live pieces go via
// {{type:id}}; the renderer swaps them for real React components built
// here. Visible texts always come from i18n/data, never from the markdown.
import React from 'react';

export type PlaceholderRenderer = (id: string) => React.ReactNode;

const PLACEHOLDER_PATTERN = /\{\{([a-z]+):([a-z0-9-]+)\}\}/g;

export const splitPlaceholders = (text: string): Array<string | { type: string; id: string }> => {
  const parts: Array<string | { type: string; id: string }> = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  PLACEHOLDER_PATTERN.lastIndex = 0;
  while ((match = PLACEHOLDER_PATTERN.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push({ type: match[1], id: match[2] });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts;
};

export const isFullPlaceholder = (text: string): { type: string; id: string } | null => {
  const match = text.trim().match(/^([a-z]+):([a-z0-9-]+)$/);
  return match ? { type: match[1], id: match[2] } : null;
};

// Rendered entries register themselves here as the components are built.
const registry: Record<string, PlaceholderRenderer> = {};

export const registerPlaceholder = (type: string, renderer: PlaceholderRenderer) => {
  registry[type] = renderer;
};

export const renderPlaceholder = (type: string, id: string): React.ReactNode => {
  const renderer = registry[type];
  if (!renderer) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[markdown] no component registered for placeholder {{${type}:${id}}}`);
    }
    return null;
  }
  return renderer(id);
};
