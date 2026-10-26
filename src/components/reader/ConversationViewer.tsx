import React, { useState } from 'react';
import { 
  User, 
  Sparkles, 
  MessageSquare, 
  FileText, 
  Pin, 
  Archive 
} from 'lucide-react';
import type { ConversationDetail } from '../../types/antigravity';
import { ThinkingBlock } from './ThinkingBlock';
import { ToolCallBlock } from './ToolCallBlock';
import { MarkdownRenderer } from './MarkdownRenderer';
import { ArtifactsViewer } from './ArtifactsViewer';

interface ConversationViewerProps {
  detail: ConversationDetail;
}

export const ConversationViewer: React.FC<ConversationViewerProps> = ({ detail }) => {
  const [activeTab, setActiveTab] = useState<'stream' | 'artifacts'>('stream');

  const { meta, steps, artifacts } = detail;

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#0d0f14]">
      {/* Sub-header info bar */}
      <div className="h-13 border-b border-white/10 px-5 flex items-center justify-between bg-[#13161c]/80 backdrop-blur-sm select-none z-10">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <h1 className="text-sm font-semibold text-white tracking-wide truncate">
              {meta.title}
            </h1>

            {meta.isPinned && (
              <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <Pin className="w-2.5 h-2.5" />
                Pinned
              </span>
            )}

            {meta.isArchived && (
              <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                <Archive className="w-2.5 h-2.5" />
                Archived
              </span>
            )}
          </div>
        </div>

        {/* View Mode Toggle: Stream vs Artifacts */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-white/5 border border-white/5 text-xs">
          <button
            onClick={() => setActiveTab('stream')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all cursor-pointer ${
              activeTab === 'stream'
                ? 'bg-blue-600 text-white shadow-sm font-medium'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chat Stream</span>
            <span className="text-[10px] px-1 rounded-full bg-black/30 font-mono">
              {steps.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('artifacts')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all cursor-pointer ${
              activeTab === 'artifacts'
                ? 'bg-indigo-600 text-white shadow-sm font-medium'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Artifacts</span>
            {artifacts.length > 0 && (
              <span className="text-[10px] px-1.5 rounded-full bg-indigo-500/30 text-indigo-200 font-mono">
                {artifacts.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'artifacts' ? (
        <ArtifactsViewer artifacts={artifacts} />
      ) : (
        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-6 max-w-4xl mx-auto w-full">
          {steps.length === 0 ? (
            <div className="text-center py-20 text-gray-500 text-sm">
              No message steps recorded in this transcript.
            </div>
          ) : (
            steps.map((step) => {
              if (step.type === 'USER_INPUT') {
                return (
                  <div key={step.stepIndex} className="flex gap-3 items-start animate-fade-in">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-md">
                      <User className="w-4 h-4 text-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-gray-300">You</span>
                        <span className="text-[11px] text-gray-500 font-mono">
                          {new Date(step.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <div className="p-4 rounded-2xl rounded-tl-sm bg-[#1c212c] border border-white/10 text-gray-100 text-sm leading-relaxed shadow-sm">
                        {step.cleanUserPrompt || step.content}
                      </div>
                    </div>
                  </div>
                );
              }

              if (step.type === 'PLANNER_RESPONSE') {
                return (
                  <div key={step.stepIndex} className="flex gap-3 items-start animate-fade-in">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center flex-shrink-0 shadow-md">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-purple-300">Antigravity Agent</span>
                        <span className="text-[11px] text-gray-500 font-mono">
                          {new Date(step.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      {/* Thinking Process if present */}
                      {step.thinking && <ThinkingBlock thinking={step.thinking} />}

                      {/* Tool Executions if present */}
                      {step.toolCalls && step.toolCalls.length > 0 && (
                        <div className="my-2 space-y-1">
                          {step.toolCalls.map((tc, idx) => (
                            <ToolCallBlock key={idx} toolCall={tc} />
                          ))}
                        </div>
                      )}

                      {/* Final Markdown Response */}
                      {step.content && (
                        <div className="p-4 rounded-2xl rounded-tl-sm bg-[#151821] border border-white/5 text-gray-200 text-sm leading-relaxed">
                          <MarkdownRenderer content={step.content} />
                        </div>
                      )}
                    </div>
                  </div>
                );
              }

              return null;
            })
          )}
        </div>
      )}
    </div>
  );
};
