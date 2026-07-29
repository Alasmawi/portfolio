import { useEffect, useState } from 'react';
import { ChevronDown, Terminal } from 'lucide-react';

const TOKEN_RE =
  /((?<!:)\/\/.*$|^\s*#(?!!).*$)|("(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`)|\b(func|package|import|struct|return|if|err|nil|type|const|var|range|for|defer|go|chan|select|case|switch|default|curl|GET|POST|PUT|DELETE|X-Header)\b|\b(\d+)\b/gm;

const TOKEN_CLASS = {
  comment: 'text-text-dim italic',
  string: 'text-ok',
  keyword: 'text-amber',
  number: 'text-steel-bright',
  plain: 'text-text-muted',
};

function tokenize(line) {
  const parts = [];
  let last = 0;
  let m;
  TOKEN_RE.lastIndex = 0;
  while ((m = TOKEN_RE.exec(line))) {
    if (m.index > last) parts.push({ text: line.slice(last, m.index), type: 'plain' });
    if (m[1]) parts.push({ text: m[1], type: 'comment' });
    else if (m[2]) parts.push({ text: m[2], type: 'string' });
    else if (m[3]) parts.push({ text: m[3], type: 'keyword' });
    else if (m[4]) parts.push({ text: m[4], type: 'number' });
    last = TOKEN_RE.lastIndex;
  }
  if (last < line.length) parts.push({ text: line.slice(last), type: 'plain' });
  return parts;
}

export default function CodeSnippet({ filename = 'snippet', code, className = '' }) {
  const lines = code.trim().split('\n');
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (window.matchMedia('(max-width: 639px)').matches) setOpen(false);
  }, []);

  return (
    <div className={`border border-base-border bg-base-surface/70 ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between border-base-border bg-base-surface/80 px-4 py-2 text-left"
        style={open ? { borderBottomWidth: 1 } : undefined}
      >
        <div className="flex items-center gap-2">
          <Terminal size={12} className="text-amber" />
          <span className="font-mono text-[11px] text-text-dim">{filename}</span>
        </div>
        <span className="flex items-center gap-2.5">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 animate-pulse-slow rounded-full bg-ok" />
            <span className="font-mono text-[10px] uppercase tracking-wider text-text-dim">
              live
            </span>
          </span>
          <ChevronDown
            size={13}
            className={`text-text-dim transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
          />
        </span>
      </button>
      {open && (
        <pre
          className="overflow-x-auto p-3 font-mono text-xs leading-relaxed sm:p-4 sm:text-[13px]"
          style={{ tabSize: 2, MozTabSize: 2 }}
        >
          {lines.map((line, i) => (
            <div key={i} className="flex gap-3 sm:gap-4">
              <span className="w-3 shrink-0 select-none text-right text-text-dim/60 sm:w-4">
                {i + 1}
              </span>
              <code>
                {tokenize(line).map((tok, j) => (
                  <span key={j} className={TOKEN_CLASS[tok.type]}>
                    {tok.text}
                  </span>
                ))}
                {line.length === 0 && ' '}
              </code>
            </div>
          ))}
        </pre>
      )}
    </div>
  );
}
