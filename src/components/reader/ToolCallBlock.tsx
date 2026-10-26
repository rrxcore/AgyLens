import React, { useState } from 'react';
import { 
  Terminal, 
  FileCode, 
  Globe, 
  Wrench, 
  ChevronDown, 
  ChevronRight, 
  CheckCircle2, 
  Copy, 
  Check 
} from 'lucide-react';
import type { ToolCall } from '../../types/antigravity';

interface ToolCallBlockProps {
  toolCall: ToolCall;
}

export const ToolCallBlock: React.FC<ToolCallBlockProps> = ({ toolCall }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const getToolIcon = () => {
    switch (toolCall.name) {
      case 'run_command':
        return <Terminal className="w-3.5 h-3.5 text-emerald-400" />;
      case 'read_file':
      case 'write_file':
      case 'edit_file':
        return <FileCode className="w-3.5 h-3.5 text-blue-400" />;
      case 'search_web':
        return <Globe className="w-3.5 h-3.5 text-cyan-400" />;
      default:
        return <Wrench className="w-3.5 h-3.5 text-amber-400" />;
    }
  };

  const commandText = toolCall.args?.CommandLine || toolCall.args?.Path || toolCall.args?.query || '';

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (commandText) {
      navigator.clipboard.writeText(commandText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="my-2 rounded-xl border border-white/10 bg-[#161a22] overflow-hidden text-xs">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="px-3.5 py-2.5 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer select-none"
      >
        <div className="flex items-center gap-2.5 min-w-0 pr-2">
          {getToolIcon()}
          
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-semibold text-gray-200 tracking-wide font-mono text-[11px] px-1.5 py-0.5 rounded bg-white/5">
              {toolCall.name}
            </span>
            <span className="text-gray-400 truncate text-xs">
              {toolCall.toolSummary || commandText}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {commandText && (
            <button
              onClick={handleCopy}
              className="p-1 rounded text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Copy argument"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          )}

          <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
            <CheckCircle2 className="w-3 h-3" />
            <span>Done</span>
          </div>

          {isOpen ? <ChevronDown className="w-3.5 h-3.5 text-gray-400" /> : <ChevronRight className="w-3.5 h-3.5 text-gray-400" />}
        </div>
      </div>

      {isOpen && (
        <div className="p-3 border-t border-white/10 bg-black/40 space-y-2.5 font-mono text-[11px]">
          {/* Detailed Arguments */}
          <div>
            <div className="text-[10px] uppercase font-semibold text-gray-500 mb-1">Arguments:</div>
            <pre className="p-2 rounded bg-white/5 text-gray-300 overflow-x-auto whitespace-pre-wrap">
              {JSON.stringify(toolCall.args, null, 2)}
            </pre>
          </div>

          {/* Execution Output */}
          {toolCall.output && (
            <div>
              <div className="text-[10px] uppercase font-semibold text-emerald-500/80 mb-1">Result Output:</div>
              <pre className="p-2 rounded bg-black/50 text-gray-300 border border-white/5 overflow-x-auto max-h-64 whitespace-pre-wrap">
                {toolCall.output}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
