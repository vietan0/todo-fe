import { Button } from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';
import parse from 'html-react-parser';
import { useEffect, useState } from 'react';
import { bundledLanguages, codeToHtml } from 'shiki';

const codeCache = new Map();

export default function ShikiHighlighter({ code, lang }: { code: string; lang?: string }) {
  const cacheKey = `${code}-${lang}`;
  const [html, setHtml] = useState(codeCache.has(cacheKey) ? codeCache.get(cacheKey) : '<p class="text-sm text-foreground-500">Rendering codeblock...</p>');
  const shikiApprovedLang = typeof lang === 'string' && lang in bundledLanguages ? lang : 'text';
  const [copied, setCopied] = useState(false);

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

  useEffect(() => {
    if (copied)
      setTimeout(() => setCopied(false), 1000);
  }, [copied]);

  const reactElem = parse(html);

  return (
    <div className="group relative my-1">
      <Button
        aria-label="Copy"
        className={`
          absolute top-1.5 right-1.5 opacity-0
          group-hover:opacity-100
        `}
        isIconOnly
        onPress={() => {
          navigator.clipboard.writeText(code);
          setCopied(true);
        }}
        radius="sm"
        size="sm"
        startContent={<Icon className="text-lg text-default-500" icon={copied ? 'material-symbols:check' : 'material-symbols:content-copy-outline'} />}
        variant="ghost"
      />
      {reactElem}
    </div>
  );
}
