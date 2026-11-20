import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface JavaCodeBlockProps {
  filename: string;
  code: string;
  subtitle?: string;
}

interface Token {
  text: string;
  type: 'keyword' | 'type' | 'string' | 'comment' | 'number' | 'annotation' | 'plain';
}

const JAVA_KEYWORDS = new Set([
  'public',
  'private',
  'protected',
  'abstract',
  'class',
  'extends',
  'implements',
  'void',
  'return',
  'if',
  'else',
  'for',
  'new',
  'throw',
  'super',
  'this',
  'final',
  'static',
  'import',
  'null',
  'true',
  'false',
]);

const JAVA_TYPES = new Set([
  'String',
  'int',
  'boolean',
  'RegistryEntity',
  'Owner',
  'Vehicle',
  'RoadVehicle',
  'Car',
  'VehicleRegistry',
  'RegistryIntegrityException',
  'IllegalArgumentException',
  'RuntimeException',
  'Map',
  'LinkedHashMap',
  'Collection',
  'Collections',
]);

function tokenizeJavaLine(line: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < line.length) {
    // Line comment
    if (line[i] === '/' && line[i + 1] === '/') {
      tokens.push({ text: line.slice(i), type: 'comment' });
      break;
    }

    // String literal
    if (line[i] === '"') {
      let end = i + 1;
      while (end < line.length) {
        if (line[end] === '\\' && end + 1 < line.length) {
          end += 2;
        } else if (line[end] === '"') {
          end += 1;
          break;
        } else {
          end += 1;
        }
      }
      tokens.push({ text: line.slice(i, end), type: 'string' });
      i = end;
      continue;
    }

    // Annotation
    if (line[i] === '@') {
      const match = line.slice(i).match(/^@[A-Za-z_][A-Za-z0-9_]*/);
      if (match) {
        tokens.push({ text: match[0], type: 'annotation' });
        i += match[0].length;
        continue;
      }
    }

    // Identifier / keyword / type
    if (/[A-Za-z_]/.test(line[i])) {
      const match = line.slice(i).match(/^[A-Za-z_][A-Za-z0-9_]*/);
      if (match) {
        const word = match[0];
        if (JAVA_KEYWORDS.has(word)) {
          tokens.push({ text: word, type: 'keyword' });
        } else if (JAVA_TYPES.has(word)) {
          tokens.push({ text: word, type: 'type' });
        } else {
          tokens.push({ text: word, type: 'plain' });
        }
        i += word.length;
        continue;
      }
    }

    // Number literal
    if (/[0-9]/.test(line[i])) {
      const match = line.slice(i).match(/^[0-9]+/);
      if (match) {
        tokens.push({ text: match[0], type: 'number' });
        i += match[0].length;
        continue;
      }
    }

    // Punctuation or whitespace
    const plainMatch = line.slice(i).match(/^[^A-Za-z0-9_"/@]+/);
    if (plainMatch) {
      tokens.push({ text: plainMatch[0], type: 'plain' });
      i += plainMatch[0].length;
    } else {
      tokens.push({ text: line[i], type: 'plain' });
      i += 1;
    }
  }

  return tokens;
}

const TOKEN_CLASSES: Record<Token['type'], string> = {
  keyword: 'text-sky-300 font-medium',
  type: 'text-amber-300',
  string: 'text-emerald-300',
  comment: 'text-slate-400 italic',
  number: 'text-violet-300',
  annotation: 'text-rose-300',
  plain: 'text-slate-100',
};

export function JavaCodeBlock({ filename, code, subtitle }: JavaCodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Fallback copy method when Clipboard API is restricted
      const textarea = document.createElement('textarea');
      textarea.value = code;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'absolute';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    }
  };

  const lines = code.split('\n');

  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950 text-slate-100">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-slate-900 px-4 py-3">
        <div className="min-w-0">
          <div className="font-mono text-xs font-medium text-slate-200">{filename}</div>
          {subtitle && <p className="mt-0.5 text-xs text-slate-400">{subtitle}</p>}
        </div>
        <button
          type="button"
          onClick={handleCopy}
          aria-label={`Copy ${filename} code`}
          className="inline-flex min-h-[36px] shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-100 transition-colors hover:border-slate-600 hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5 text-slate-300" aria-hidden="true" />
              <span>Copy code</span>
            </>
          )}
        </button>
      </div>

      <div className="overflow-x-auto p-4">
        <pre className="font-mono text-[13px] leading-6">
          <code>
            {lines.map((line, index) => {
              const tokens = tokenizeJavaLine(line);
              return (
                <div key={index} className="flex">
                  <span
                    className="mr-4 inline-block w-7 shrink-0 select-none text-right text-slate-500 tabular-nums"
                    aria-hidden="true"
                  >
                    {index + 1}
                  </span>
                  <span className="whitespace-pre">
                    {tokens.length === 0 ? (
                      ' '
                    ) : (
                      tokens.map((token, tokenIdx) => (
                        <span key={tokenIdx} className={TOKEN_CLASSES[token.type]}>
                          {token.text}
                        </span>
                      ))
                    )}
                  </span>
                </div>
              );
            })}
          </code>
        </pre>
      </div>
    </div>
  );
}
