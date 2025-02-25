import { Code } from '@heroui/react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function CustomMarkdown({ children }: { children: string | null | undefined }) {
  return (
    <Markdown
      components={{
        h1: ({ ...props }) => <h1 {...props} className="text-large font-semibold" />,
        h2: ({ ...props }) => <h2 {...props} className="text-medium font-semibold"></h2>,
        h3: ({ ...props }) => <h2 {...props} className="font-medium"></h2>,
        code: ({ children }) => <Code className="text-tiny">{children}</Code>,
        ul: ({ ...props }) => <ul {...props} className="list-inside list-disc" />,
        ol: ({ ...props }) => <ol {...props} className="list-inside list-decimal" />,
        a: ({ ...props }) => (
          <a
            {...props}
            className="underline hover:text-primary-500"
            onClick={e => e.stopPropagation()}
            target="_blank"
          />
        ),
      }}
      remarkPlugins={[remarkGfm]}
    >
      {children}
    </Markdown>
  );
}
