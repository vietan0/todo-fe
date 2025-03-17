import parse from 'html-react-parser';
import { useEffect, useState } from 'react';
import { codeToHtml } from 'shiki';

export default function ShikiHighlighter({ code, lang }: { code: string; lang?: string }) {
  const [html, setHtml] = useState('<p class="text-sm">Rendering codeblock...</p>');

  useEffect(() => {
    codeToHtml (code, {
      lang: lang || 'text',
      theme: 'dark-plus',
    }).then((val) => {
      setHtml(val);
    });
  }, [code, lang]);

  const reactElem = parse(html);

  return reactElem;
}
