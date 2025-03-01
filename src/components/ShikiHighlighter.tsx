import parse from 'html-react-parser';
import { createHighlighter } from 'shiki';

const highlighter = await createHighlighter({
  themes: ['dark-plus'],
  langs: ['javascript'],
});

export default function ShikiHighlighter({ code, lang }: { code: string; lang?: string }) {
  const html = highlighter.codeToHtml(code, {
    lang: lang || 'text',
    theme: 'dark-plus',
  });

  const reactElem = parse(html);

  return reactElem;
}
