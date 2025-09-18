import parse from 'html-react-parser';
import { useEffect, useState } from 'react';
import { bundledLanguages, codeToHtml } from 'shiki';

const codeCache = new Map();

export default function ShikiHighlighter({ code, lang }: { code: string; lang?: string }) {
  const cacheKey = `${code}-${lang}`;
  const [html, setHtml] = useState(codeCache.has(cacheKey) ? codeCache.get(cacheKey) : '<p class="text-sm text-foreground-500">Rendering codeblock...</p>');
  const shikiApprovedLang = typeof lang === 'string' && lang in bundledLanguages ? lang : 'text';

  useEffect(() => {
    if (!codeCache.has(cacheKey)) {
      codeToHtml(code, {
        lang: shikiApprovedLang,
        theme: 'dark-plus',
      }).then((val) => {
        setHtml(val);
        codeCache.set(cacheKey, val);
      }).catch((err) => {
        console.error(err);
      });
    }
  }, [code, lang]);

  const reactElem = parse(html);

  return reactElem;
}
