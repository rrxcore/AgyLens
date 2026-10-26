import React, { useState } from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  // Split content into code blocks vs text blocks
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-3 leading-relaxed text-sm text-gray-200">
      {parts.map((part, index) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          return <CodeBlock key={index} codeSegment={part} />;
        }
        return <FormattedTextBlock key={index} text={part} />;
      })}
    </div>
  );
};

const CodeBlock: React.FC<{ codeSegment: string }> = ({ codeSegment }) => {
  const [copied, setCopied] = useState(false);

  // Extract language and actual code
  const match = codeSegment.match(/^```([a-zA-Z0-9_-]*)\r?\n([\s\S]*?)```$/);
  const lang = match ? match[1] || 'plaintext' : 'plaintext';
  const code = match ? match[2] : codeSegment.replace(/^```|```$/g, '');

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-3 rounded-xl border border-white/10 bg-[#0f1115] overflow-hidden text-xs shadow-md">
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-white/5 border-b border-white/5 select-none">
        <span className="font-mono text-[11px] font-medium text-gray-400 uppercase tracking-wider">
          {lang}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-white px-2 py-0.5 rounded hover:bg-white/10 transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="p-3.5 overflow-x-auto font-mono text-[12px] leading-relaxed text-gray-200">
        <pre>{code}</pre>
      </div>
    </div>
  );
};

const FormattedTextBlock: React.FC<{ text: string }> = ({ text }) => {
  const lines = text.split(/\r?\n/);
  const elements: React.ReactNode[] = [];

  let inList = false;
  let listItems: React.ReactNode[] = [];

  const flushList = () => {
    if (inList && listItems.length > 0) {
      elements.push(
        <ul key={`ul-${elements.length}`} className="list-disc list-inside space-y-1 my-2 pl-2">
          {listItems}
        </ul>
      );
      listItems = [];
      inList = false;
    }
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushList();
      return;
    }

    // Headers
    if (line.startsWith('### ')) {
      flushList();
      elements.push(
        <h4 key={idx} className="text-sm font-bold text-gray-100 mt-3 mb-1">
          {renderInline(line.slice(4))}
        </h4>
      );
      return;
    }
    if (line.startsWith('## ')) {
      flushList();
      elements.push(
        <h3 key={idx} className="text-base font-bold text-white mt-4 mb-2 border-b border-white/5 pb-1">
          {renderInline(line.slice(3))}
        </h3>
      );
      return;
    }
    if (line.startsWith('# ')) {
      flushList();
      elements.push(
        <h2 key={idx} className="text-lg font-bold text-white mt-5 mb-2">
          {renderInline(line.slice(2))}
        </h2>
      );
      return;
    }

    // Blockquote
    if (line.startsWith('> ')) {
      flushList();
      elements.push(
        <blockquote key={idx} className="border-l-2 border-blue-500/50 pl-3 py-1 my-2 text-gray-400 italic">
          {renderInline(line.slice(2))}
        </blockquote>
      );
      return;
    }

    // Bullet Lists
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      inList = true;
      listItems.push(
        <li key={idx} className="text-gray-300">
          {renderInline(trimmed.slice(2))}
        </li>
      );
      return;
    }

    // Regular paragraph
    flushList();
    elements.push(
      <p key={idx} className="text-gray-300 leading-relaxed my-1">
        {renderInline(line)}
      </p>
    );
  });

  flushList();

  return <>{elements}</>;
};

function renderInline(str: string): React.ReactNode[] {
  // Parse inline elements: `code`, **bold**, *italic*, [link](url)
  const tokens = str.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g);

  return tokens.map((token, i) => {
    if (token.startsWith('`') && token.endsWith('`')) {
      return (
        <code key={i} className="px-1.5 py-0.5 rounded bg-white/10 text-blue-300 font-mono text-[12px]">
          {token.slice(1, -1)}
        </code>
      );
    }
    if (token.startsWith('**') && token.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-white">
          {token.slice(2, -2)}
        </strong>
      );
    }
    if (token.startsWith('*') && token.endsWith('*')) {
      return (
        <em key={i} className="italic text-gray-200">
          {token.slice(1, -1)}
        </em>
      );
    }
    if (token.startsWith('[') && token.includes('](') && token.endsWith(')')) {
      const match = token.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (match) {
        return (
          <a
            key={i}
            href={match[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-0.5 text-blue-400 hover:text-blue-300 underline underline-offset-2"
          >
            <span>{match[1]}</span>
            <ExternalLink className="w-2.5 h-2.5 opacity-70" />
          </a>
        );
      }
    }
    return token;
  });
}
