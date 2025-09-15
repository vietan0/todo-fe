import parse from 'html-react-parser';
import { useEffect, useState } from 'react';
import { bundledLanguages, codeToHtml } from 'shiki';

export default function ShikiHighlighter({ code, lang }: { code: string; lang?: string }) {
  const [html, setHtml] = useState('<p class="text-sm">Rendering codeblock...</p>');
  const shikiApprovedLang = typeof lang === 'string' && lang in bundledLanguages ? lang : 'text';

  useEffect(() => {
    codeToHtml(code, {
      lang: shikiApprovedLang,
      theme: 'dark-plus',
    }).then((val) => {
      setHtml(val);
    }).catch((err) => {
      console.error(err);
    });
  }, [code, lang]);

  const reactElem = parse(html);

  return reactElem;
}
