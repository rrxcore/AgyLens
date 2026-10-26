import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Archive, 
  Pin, 
  FileText, 
  ChevronDown, 
  ChevronRight,
  FolderOpen
} from 'lucide-react';
import type { ActiveFilterTab, ConversationMeta } from '../../types/antigravity';

interface ConversationSidebarProps {
  conversations: ConversationMeta[];
  selectedId?: string;
  onSelect: (id: string) => void;
  activeFilter: ActiveFilterTab;
  setActiveFilter: (tab: ActiveFilterTab) => void;
  onOpenFolder: () => void;
}

export const ConversationSidebar: React.FC<ConversationSidebarProps> = ({
  conversations,
  selectedId,
  onSelect,
  activeFilter,
  setActiveFilter,
  onOpenFolder,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isArchiveCollapsed, setIsArchiveCollapsed] = useState(false);

  // Filter conversations by query and active tab
  const filtered = useMemo(() => {
    return conversations.filter(c => {
      // Search query check
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = c.title.toLowerCase().includes(q);
        const matchesPreview = c.preview?.toLowerCase().includes(q);
        const matchesUri = c.workspaceUri?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesPreview && !matchesUri) return false;
      }

      // Tab filter
      if (activeFilter === 'active') return !c.isArchived;
      if (activeFilter === 'archived') return c.isArchived;
      if (activeFilter === 'pinned') return c.isPinned;
      return true;
    });
  }, [conversations, searchQuery, activeFilter]);

  // Split into categories for structured tree view
  const pinnedList = useMemo(() => filtered.filter(c => c.isPinned && !c.isArchived), [filtered]);
  const activeList = useMemo(() => filtered.filter(c => !c.isPinned && !c.isArchived), [filtered]);
  const archivedList = useMemo(() => filtered.filter(c => c.isArchived), [filtered]);

  const renderConversationItem = (item: ConversationMeta) => {
    const isSelected = item.id === selectedId;

    return (
      <div
        key={item.id}
        onClick={() => onSelect(item.id)}
        className={`group relative flex items-center justify-between px-3 py-2.5 rounded-lg text-sm cursor-pointer transition-all duration-150 select-none ${
          isSelected
            ? 'bg-[#212631] text-white shadow-sm border border-white/10'
            : 'text-gray-300 hover:bg-white/5 hover:text-white'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0 pr-2">
          {/* Running Indicator (Blue Dot) */}
          {item.isRunning && (
            <span 
              className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)] flex-shrink-0 animate-pulse" 
              title="Active / Running session"
            />
          )}

          {/* Title */}
          <span className="truncate font-normal tracking-wide text-[13.5px]">
            {item.title}
          </span>
        </div>

        {/* Right side: Relative Time & Badges */}
        <div className="flex items-center gap-1.5 flex-shrink-0 text-xs text-gray-500 group-hover:text-gray-400">
          {item.artifactsCount > 0 && (
            <span title={`${item.artifactsCount} artifacts`}>
              <FileText className="w-3 h-3 text-indigo-400/80" />
            </span>
          )}
          <span className="font-mono text-[11.5px] tabular-nums">
            {item.relativeTimeStr}
          </span>
        </div>
      </div>
    );
  };

  return (
    <aside className="w-72 lg:w-80 h-full flex flex-col bg-[#14171d] border-r border-white/10 select-none">
      {/* Sidebar Header */}
      <div className="p-3 pb-2 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-200 tracking-wide">
            Conversations
          </span>
          <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-white/5 text-gray-400 font-mono">
            {conversations.length}
          </span>
        </div>

        <button
          onClick={onOpenFolder}
          className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          title="Open New Directory / Chat"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Search Input */}
      <div className="px-3 pt-2 pb-2">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-gray-500" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1b1f27] border border-white/5 rounded-md pl-8 pr-3 py-1.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2 text-xs text-gray-500 hover:text-gray-300"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Mobile / Compact Filter Pill Bar */}
      <div className="flex md:hidden px-3 pb-2 gap-1 overflow-x-auto text-[11px]">
        {(['all', 'active', 'pinned', 'archived'] as ActiveFilterTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`px-2 py-1 rounded capitalize whitespace-nowrap ${
              activeFilter === tab ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-400'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto px-2 py-1 space-y-4">
        {filtered.length === 0 ? (
          <div className="p-6 text-center text-xs text-gray-500">
            No conversations found.
          </div>
        ) : (
          <>
            {/* Pinned Section */}
            {pinnedList.length > 0 && activeFilter !== 'archived' && (
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-semibold text-amber-400 uppercase tracking-wider">
                  <Pin className="w-3 h-3" />
                  <span>Pinned ({pinnedList.length})</span>
                </div>
                <div className="space-y-0.5">
                  {pinnedList.map(renderConversationItem)}
                </div>
              </div>
            )}

            {/* Active Conversations Section */}
            {activeList.length > 0 && activeFilter !== 'archived' && activeFilter !== 'pinned' && (
              <div className="space-y-1">
                {pinnedList.length > 0 && (
                  <div className="px-2 py-1 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                    Recent
                  </div>
                )}
                <div className="space-y-0.5">
                  {activeList.map(renderConversationItem)}
                </div>
              </div>
            )}

            {/* Archive Section - Dedicated & Clearly Highlighted */}
            {archivedList.length > 0 && activeFilter !== 'pinned' && (
              <div className="space-y-1 pt-2 border-t border-white/5">
                <button
                  onClick={() => setIsArchiveCollapsed(!isArchiveCollapsed)}
                  className="w-full flex items-center justify-between px-2 py-1.5 rounded text-[11px] font-semibold text-purple-400 hover:text-purple-300 hover:bg-white/5 uppercase tracking-wider transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-1.5">
                    <Archive className="w-3 h-3" />
                    <span>Archive ({archivedList.length})</span>
                  </div>
                  {isArchiveCollapsed ? (
                    <ChevronRight className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>

                {!isArchiveCollapsed && (
                  <div className="space-y-0.5 pl-1 opacity-90">
                    {archivedList.map(renderConversationItem)}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-white/5 text-[11px] text-gray-500 flex items-center justify-between">
        <span className="flex items-center gap-1">
          <FolderOpen className="w-3 h-3 text-gray-600" />
          AgyLens Local
        </span>
        <span className="font-mono text-gray-600">v1.0</span>
      </div>
    </aside>
  );
};
