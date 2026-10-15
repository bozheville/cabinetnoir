import React from 'react';
import { Marked } from 'marked';
import styled from 'styled-components';

import { renderPlaceholder, splitPlaceholders } from './registry';
// Side-effect import: registers the live components for placeholders.
import './placeholders';

// Token-walking markdown renderer (decision: marked.lexer, no HTML
// strings). Renders a fixed element set; raw HTML in the source is
// skipped on purpose.

const Wrapper = styled.div`
  max-width: 640px;
  line-height: 1.6;
  text-align: left;

  h1, h2, h3, h4, h5, h6 {
    margin: 24px 0 8px;
    font-weight: 700;
  }

  h1 { font-size: 24px; }
  h2 { font-size: 20px; }
  h3 { font-size: 16px; }

  p { margin: 8px 0; }

  ul, ol {
    margin: 8px 0;
    padding-left: 24px;
  }

  blockquote {
    margin: 8px 0;
    padding: 4px 12px;
    border-left: 3px solid ${({ theme }) => theme.colorScheme.gray[300]};
    color: ${({ theme }) => theme.colors.textLight};
  }

  pre {
    background: ${({ theme }) => theme.colorScheme.gray[100]};
    padding: 12px;
    border-radius: 4px;
    overflow-x: auto;
    font-family: monospace;
    font-size: 13px;
  }

  code {
    font-family: monospace;
    font-size: 13px;
    background: ${({ theme }) => theme.colorScheme.gray[100]};
    padding: 1px 4px;
    border-radius: 3px;
  }

  pre code {
    background: none;
    padding: 0;
  }

  table {
    border-collapse: collapse;
    margin: 8px 0;
  }

  th, td {
    border: 1px solid ${({ theme }) => theme.colorScheme.gray[300]};
    padding: 4px 8px;
    text-align: left;
  }

  a {
    color: ${({ theme }) => theme.colorScheme.blue[500]};
  }
`;

// marked ships its own lexer instance options; a private instance avoids
// touching any global state.
const lexer = new Marked({ gfm: true });

// Inline nodes may carry placeholders inside their text.
const renderInlineText = (text: string, keyPrefix: string): React.ReactNode[] =>
  splitPlaceholders(text).map((part, index) => {
    if (typeof part === 'string') {
      return part;
    }
    return (
      <React.Fragment key={`${keyPrefix}-${index}`}>
        {renderPlaceholder(part.type, part.id)}
      </React.Fragment>
    );
  });

const renderInlineTokens = (tokens: any[] = [], keyPrefix = 'i'): React.ReactNode[] =>
  tokens.map((token, index) => {
    const key = `${keyPrefix}-${index}`;

    switch (token.type) {
      case 'text':
        return <React.Fragment key={key}>{renderInlineText(token.text, key)}</React.Fragment>;
      case 'strong':
        return <strong key={key}>{renderInlineTokens(token.tokens, key)}</strong>;
      case 'em':
        return <em key={key}>{renderInlineTokens(token.tokens, key)}</em>;
      case 'del':
        return <del key={key}>{renderInlineTokens(token.tokens, key)}</del>;
      case 'codespan':
        return <code key={key}>{token.text}</code>;
      case 'br':
        return <br key={key} />;
      case 'escape':
        return <React.Fragment key={key}>{token.text}</React.Fragment>;
      case 'link': {
        const external = /^https?:\/\//.test(token.href);
        return (
          <a
            key={key}
            href={token.href}
            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            {renderInlineTokens(token.tokens, key)}
          </a>
        );
      }
      case 'image':
        return <img key={key} src={token.href} alt={token.text || ''} />;
      case 'html':
        // Raw HTML is never rendered (decision: token renderer only).
        if (process.env.NODE_ENV !== 'production') {
          console.warn(`[markdown] skipped raw HTML: ${String(token.raw).slice(0, 40)}`);
        }
        return null;
      default:
        if (process.env.NODE_ENV !== 'production') {
          console.warn(`[markdown] unhandled inline token type: ${token.type}`);
        }
        return null;
    }
  });

const isPlaceholderParagraph = (token: any): { type: string; id: string } | null => {
  if (token.type !== 'paragraph' || token.tokens?.length !== 1 || token.tokens[0].type !== 'text') {
    return null;
  }
  // A paragraph consisting of exactly one placeholder.
  const parts = splitPlaceholders(token.tokens[0].raw ?? token.tokens[0].text ?? '');
  if (parts.length === 1 && typeof parts[0] !== 'string') {
    return parts[0];
  }
  return null;
};

const renderBlockTokens = (tokens: any[] = [], keyPrefix = 'b'): React.ReactNode[] =>
  tokens.map((token, index) => {
    const key = `${keyPrefix}-${index}`;
    const placeholder = isPlaceholderParagraph(token);
    if (placeholder) {
      return (
        <React.Fragment key={key}>
          {renderPlaceholder(placeholder.type, placeholder.id)}
        </React.Fragment>
      );
    }

    switch (token.type) {
      case 'heading': {
        const Tag = `h${Math.min(6, Math.max(1, token.depth))}` as keyof React.JSX.IntrinsicElements;
        return <Tag key={key}>{renderInlineTokens(token.tokens, key)}</Tag>;
      }
      case 'paragraph':
      // marked emits block-level `text` tokens for tight list items;
      // render them like paragraphs.
      case 'text':
        return <p key={key}>{renderInlineTokens(token.tokens ?? [], key)}</p>;
      case 'list': {
        const items = token.items.map((item: any, itemIndex: number) => (
          <li key={`${key}-${itemIndex}`}>{renderBlockTokens(item.tokens, `${key}-${itemIndex}`)}</li>
        ));
        return token.ordered
          ? <ol key={key} start={token.start ?? undefined}>{items}</ol>
          : <ul key={key}>{items}</ul>;
      }
      case 'blockquote':
        return <blockquote key={key}>{renderBlockTokens(token.tokens, key)}</blockquote>;
      case 'code':
        return (
          <pre key={key}>
            <code>{token.text}</code>
          </pre>
        );
      case 'table': {
        const header = token.header.map((cell: any, cellIndex: number) => (
          <th key={cellIndex}>{renderInlineTokens(cell.tokens, `${key}-h-${cellIndex}`)}</th>
        ));
        const body = token.rows.map((row: any, rowIndex: number) => (
          <tr key={rowIndex}>
            {row.map((cell: any, cellIndex: number) => (
              <td key={cellIndex}>{renderInlineTokens(cell.tokens, `${key}-${rowIndex}-${cellIndex}`)}</td>
            ))}
          </tr>
        ));
        return (
          <table key={key}>
            <thead><tr>{header}</tr></thead>
            <tbody>{body}</tbody>
          </table>
        );
      }
      case 'hr':
        return <hr key={key} />;
      case 'space':
        return null;
      case 'html':
        // Raw HTML is never rendered (decision: token renderer only).
        if (process.env.NODE_ENV !== 'production') {
          console.warn(`[markdown] skipped raw HTML: ${String(token.raw).slice(0, 40)}`);
        }
        return null;
      default:
        if (process.env.NODE_ENV !== 'production') {
          console.warn(`[markdown] unhandled block token type: ${token.type}`);
        }
        return null;
    }
  });

interface MarkdownContentProps {
  source: string;
}

const MarkdownContent: React.FC<MarkdownContentProps> = ({ source }) => (
  <Wrapper>{renderBlockTokens(lexer.lexer(source))}</Wrapper>
);

MarkdownContent.displayName = 'MarkdownContent';

export default MarkdownContent;
