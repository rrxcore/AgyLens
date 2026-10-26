import React, { useState } from 'react';
import { Brain, ChevronDown, ChevronRight } from 'lucide-react';

interface ThinkingBlockProps {
  thinking: string;
}

export const ThinkingBlock: React.FC<ThinkingBlockProps> = ({ thinking }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Compute a rough word count / read time estimate
  const words = thinking.trim().split(/\s+/).length;

  return (
    <div className="my-2 rounded-xl border border-indigo-500/20 bg-indigo-950/15 overflow-hidden transition-all duration-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3.5 py-2.5 flex items-center justify-between text-xs text-indigo-300 hover:text-indigo-200 hover:bg-indigo-500/10 transition-colors cursor-pointer select-none"
      >
        <div className="flex items-center gap-2">
          <Brain className="w-3.5 h-3.5 text-indigo-400" />
          <span className="font-semibold tracking-wide">Thinking Process</span>
          <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono">
            {words} words
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-indigo-400/80">
          <span className="text-[11px]">{isOpen ? 'Hide' : 'Inspect'}</span>
          {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </div>
      </button>

      {isOpen && (
        <div className="px-4 py-3 border-t border-indigo-500/15 bg-black/30 text-xs text-indigo-200/90 font-mono whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
          {thinking}
        </div>
      )}
    </div>
  );
};
