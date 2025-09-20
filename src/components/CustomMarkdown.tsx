import type { JSXElementConstructor, ReactElement } from 'react';
import { Code } from '@heroui/react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import cn from '../utils/cn';
import ShikiHighlighter from './ShikiHighlighter';

export default function CustomMarkdown({ children, field, isTruncated = false }: {
  children: string | null | undefined;
  field: 'name' | 'body';
  isTruncated?: boolean;
}) {
  return (
    <Markdown
      components={{
        h1: ({ node, ...props }) => (
          <h1
            {...props}
            className={cn(
              'font-semibold',
              isTruncated || `
                text-base
                xs:text-lg
              `,
            )}
          />
        ),
        h2: ({ node, ...props }) => (
          <h2
            {...props}
            className={cn('font-semibold', isTruncated || `
              text-sm
              xs:text-base
            `)}
          />
        ),
        h3: ({ node, ...props }) => (
          <h3
            {...props}
            className={cn('font-normal', isTruncated || `
              text-base
              xs:font-medium
            `)}
          />
        ),
        p: ({ node, ...props }) => (
          <p
            {...props}
            className={cn(
              'inline-block',
              (field === 'name' || !isTruncated) && 'whitespace-pre-wrap',
            )}
          />
        ),
        code: ({ children }) => {
          if (children === undefined)
            return '';

          const noNewLines = field === 'name' && typeof children === 'string'
            ? children.replaceAll(/\n/g, ' ')
            : children;

          return (
            <Code className={cn(
              'rounded-md text-xs',
              (!isTruncated || field === 'name') && 'inline',
              !isTruncated && 'whitespace-pre-wrap',
            )}
            >
              {noNewLines}
            </Code>
          );
        },
        li: ({ node, ...props }) => (
          <li {...props} className={cn(isTruncated && 'inline')} />
        ),
        pre: isTruncated
          ? 'pre'
          : ({ children }) => {
              const typedChildren = children as ReactElement<any, string | JSXElementConstructor<any>>;
              const { className, children: code } = typedChildren.props;
              let lang: string | undefined;

              if (className !== undefined) {
                const langRegex = /(?<=language-)[\w-]+/g;
                lang = className.match(langRegex)[0];
              }

              return <ShikiHighlighter code={code} lang={lang} />;
            },
        ul: ({ node, ...props }) => (
          <ul {...props} className="list-inside list-disc" />
        ),
        ol: ({ node, ...props }) => (
          <ol {...props} className="list-inside list-decimal" />
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
      disallowedElements={field === 'name' ? ['pre'] : []}
      remarkPlugins={[remarkGfm]}
      unwrapDisallowed
    >
      {children}
    </Markdown>
  );
}
