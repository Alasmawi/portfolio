import { Terminal } from 'lucide-react';

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

  return (
    <div className={`border border-base-border bg-base-surface/70 ${className}`}>
      <div className="flex items-center justify-between border-b border-base-border bg-base-surface/80 px-4 py-2">
        <div className="flex items-center gap-2">
          <Terminal size={12} className="text-amber" />
          <span className="font-mono text-[11px] text-text-dim">{filename}</span>
        </div>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 animate-pulse-slow rounded-full bg-ok" />
          <span className="font-mono text-[10px] uppercase tracking-wider text-text-dim">
            live
          </span>
        </span>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed sm:text-[13px]">
        {lines.map((line, i) => (
          <div key={i} className="flex gap-4">
            <span className="w-4 shrink-0 select-none text-right text-text-dim/60">
              {i + 1}
            </span>
            <code>
              {tokenize(line).map((tok, j) => (
                <span key={j} className={TOKEN_CLASS[tok.type]}>
                  {tok.text}
                </span>
              ))}
              {line.length === 0 && ' '}
            </code>
          </div>
        ))}
      </pre>
    </div>
  );
}
