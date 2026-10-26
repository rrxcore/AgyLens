import React from 'react';
import { 
  FolderOpen, 
  Archive, 
  Pin, 
  Sparkles, 
  Download, 
  Layers, 
  Terminal
} from 'lucide-react';
import type { ActiveFilterTab, ConversationMeta } from '../../types/antigravity';

interface HeaderProps {
  currentMeta?: ConversationMeta;
  activeFilter: ActiveFilterTab;
  setActiveFilter: (tab: ActiveFilterTab) => void;
  stats: {
    totalScanned: number;
    activeCount: number;
    archivedCount: number;
    pinnedCount: number;
  };
  onOpenFolder: () => void;
  onOpenZip: () => void;
  onLoadDemo: () => void;
  onExportMarkdown?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentMeta,
  activeFilter,
  setActiveFilter,
  stats,
  onOpenFolder,
  onOpenZip,
  onLoadDemo,
  onExportMarkdown,
}) => {
  return (
    <header className="h-14 border-b border-white/10 bg-[#12141a]/90 backdrop-blur-md px-4 flex items-center justify-between select-none z-30">
      {/* Brand & Active Chat Info */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Layers className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-base tracking-wide bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent hidden sm:inline">
            AgyLens
          </span>
        </div>

        {currentMeta && (
          <div className="flex items-center gap-2 pl-3 border-l border-white/10 min-w-0">
            <span className="text-sm font-medium text-gray-200 truncate max-w-[260px] md:max-w-[400px]">
              {currentMeta.title}
            </span>
            {currentMeta.workspaceUri && (
              <span className="hidden lg:inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-400 font-mono truncate max-w-[200px]" title={currentMeta.workspaceUri}>
                <Terminal className="w-3 h-3 text-gray-500 flex-shrink-0" />
                {currentMeta.workspaceUri.split(/[\\/]/).pop()}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="hidden md:flex items-center p-1 rounded-lg bg-white/5 border border-white/5 text-xs font-medium">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3 py-1 rounded-md transition-colors ${
            activeFilter === 'all'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          All ({stats.totalScanned})
        </button>
        <button
          onClick={() => setActiveFilter('active')}
          className={`px-3 py-1 rounded-md transition-colors ${
            activeFilter === 'active'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          Active ({stats.activeCount})
        </button>
        <button
          onClick={() => setActiveFilter('pinned')}
          className={`flex items-center gap-1 px-3 py-1 rounded-md transition-colors ${
            activeFilter === 'pinned'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <Pin className="w-3 h-3" />
          Pinned ({stats.pinnedCount})
        </button>
        <button
          onClick={() => setActiveFilter('archived')}
          className={`flex items-center gap-1 px-3 py-1 rounded-md transition-colors ${
            activeFilter === 'archived'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <Archive className="w-3 h-3" />
          Archive ({stats.archivedCount})
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenFolder}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-gray-200 transition-all cursor-pointer shadow-sm active:scale-95"
          title="Open Antigravity directory (or .gemini/antigravity)"
        >
          <FolderOpen className="w-3.5 h-3.5 text-blue-400" />
          <span className="hidden sm:inline">Open Folder</span>
        </button>

        <button
          onClick={onOpenZip}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-gray-200 transition-all cursor-pointer shadow-sm active:scale-95"
          title="Open Antigravity ZIP archive"
        >
          <Archive className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden sm:inline">Open ZIP</span>
        </button>

        <button
          onClick={onLoadDemo}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600/30 to-purple-600/30 hover:from-blue-600/40 hover:to-purple-600/40 border border-blue-500/30 text-xs font-medium text-blue-300 transition-all cursor-pointer shadow-sm active:scale-95"
          title="Load sample Antigravity session"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span className="hidden sm:inline">Demo</span>
        </button>

        {onExportMarkdown && currentMeta && (
          <button
            onClick={onExportMarkdown}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 transition-all cursor-pointer active:scale-95"
            title="Export conversation as Markdown"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </header>
  );
};
