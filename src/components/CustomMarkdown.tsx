import type { JSXElementConstructor, ReactElement } from 'react';
import { Code } from '@heroui/react';
import Markdown from 'react-markdown';

import remarkGfm from 'remark-gfm';
import cn from '../utils/cn';

import ShikiHighlighter from './ShikiHighlighter';

export default function CustomMarkdown({ children, isTruncated = false }: { children: string | null | undefined; isTruncated?: boolean }) {
  return (
    <Markdown
      components={{
        h1: ({ node, ...props }) => (
          <h1
            {...props}
            className={cn('font-semibold', isTruncated || 'text-base xs:text-lg')}
          />
        ),
        h2: ({ node, ...props }) => (
          <h2
            {...props}
            className={cn('font-semibold', isTruncated || 'text-sm xs:text-base')}
          />
        ),
        h3: ({ node, ...props }) => (
          <h3
            {...props}
            className={cn('font-normal', isTruncated || 'text-base xs:font-medium')}
          />
        ),
        code: ({ children }) => (
          <Code className={cn('text-xs', isTruncated || 'whitespace-pre-wrap')}>
            {children}
          </Code>
        ),
        pre: isTruncated
          ? 'pre'
          : ({ children }) => {
              const typedChildren = children as ReactElement<any, string | JSXElementConstructor<any>>;
              const { className, children: code } = typedChildren.props;
              const langRegex = /(?<=language-)[\w-]+/g;
              const [lang] = className.match(langRegex);

              return <ShikiHighlighter code={code} lang={lang} />;
            },
        ul: ({ node, ...props }) => (
          <ul
            {...props}
            className="list-inside list-disc"
          />
        ),
        ol: ({ node, ...props }) => (
          <ol
            {...props}
            className="list-inside list-decimal"
          />
        ),
        a: ({ node, ...props }) => (
          <a
            {...props}
            className={`
              underline
              hover:text-primary-500
            `}
            onClick={e => e.stopPropagation()}
            target="_blank"
          />
        ),
        img: isTruncated
          ? ({ node, alt, ...props }) => (
              <span
                {...props}
                className={`
                  underline
                  hover:text-primary-500
                `}
              >
                {alt || 'Image'}
              </span>
            )
          : 'img',
      }}
      remarkPlugins={[remarkGfm]}
    >
      {children}
    </Markdown>
  );
}
