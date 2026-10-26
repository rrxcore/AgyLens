import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { 
  ActiveFilterTab, 
  ConversationDetail, 
  ConversationMeta 
} from './types/antigravity';
import { 
  getFilesFromDataTransfer, 
  processIngestedFiles, 
  extractFilesFromZip,
  type VirtualFile 
} from './parser/smartScanner';
import { SAMPLE_CONVERSATIONS, SAMPLE_DETAIL_MAP } from './sample/sampleSession';
import { Header } from './components/layout/Header';
import { ConversationSidebar } from './components/sidebar/ConversationSidebar';
import { ConversationViewer } from './components/reader/ConversationViewer';
import { DropZoneOverlay } from './components/landing/DropZoneOverlay';

export function App() {
  const [conversations, setConversations] = useState<ConversationMeta[]>([]);
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  const [currentDetail, setCurrentDetail] = useState<ConversationDetail | null>(null);
  const [activeFilter, setActiveFilter] = useState<ActiveFilterTab>('all');
  const [isDragging, setIsDragging] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const folderInputRef = useRef<HTMLInputElement>(null);
  const zipInputRef = useRef<HTMLInputElement>(null);

  // Detail loader reference
  const detailLoaderRef = useRef<((id: string) => Promise<ConversationDetail>) | null>(null);

  const stats = {
    totalScanned: conversations.length,
    activeCount: conversations.filter(c => !c.isArchived).length,
    archivedCount: conversations.filter(c => c.isArchived).length,
    pinnedCount: conversations.filter(c => c.isPinned).length,
  };

  const handleSelectConversation = useCallback(async (id: string) => {
    setSelectedId(id);

    // Check if in sample map first
    if (SAMPLE_DETAIL_MAP[id]) {
      setCurrentDetail(SAMPLE_DETAIL_MAP[id]);
      return;
    }

    if (detailLoaderRef.current) {
      try {
        const detail = await detailLoaderRef.current(id);
        setCurrentDetail(detail);
      } catch (err) {
        console.error('Failed loading detail:', err);
      }
    }
  }, []);

  // Process any list of VirtualFiles
  const handleIngestVirtualFiles = async (virtualFiles: VirtualFile[]) => {
    if (virtualFiles.length === 0) return;
    setIsScanning(true);

    try {
      const result = await processIngestedFiles(virtualFiles);
      setConversations(result.conversations);
      detailLoaderRef.current = result.loadConversationDetail;

      // Automatically select the first or first active conversation
      const firstActive = result.conversations.find(c => !c.isArchived) || result.conversations[0];
      if (firstActive) {
        handleSelectConversation(firstActive.id);
      }
    } catch (err) {
      console.error('Error processing files:', err);
    } finally {
      setIsScanning(false);
    }
  };

  // Fullscreen Drag & Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.relatedTarget === null) {
      setIsDragging(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    try {
      const files = await getFilesFromDataTransfer(e.dataTransfer);
      await handleIngestVirtualFiles(files);
    } catch (err) {
      console.error('Error during drop processing:', err);
    }
  };

  // Hidden folder input
  const handleFolderInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    const virtualFiles: VirtualFile[] = [];
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      virtualFiles.push({
        path: (file as any).webkitRelativePath || file.name,
        name: file.name,
        size: file.size,
        readText: () => file.text(),
      });
    }

    await handleIngestVirtualFiles(virtualFiles);
    e.target.value = '';
  };

  // Hidden zip input
  const handleZipInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsScanning(true);
      const virtualFiles = await extractFilesFromZip(file);
      await handleIngestVirtualFiles(virtualFiles);
    } catch (err) {
      console.error('Error unzipping:', err);
    } finally {
      setIsScanning(false);
      e.target.value = '';
    }
  };

  // Load Demo Data
  const handleLoadDemo = () => {
    setConversations(SAMPLE_CONVERSATIONS);
    detailLoaderRef.current = async (id: string) => {
      return SAMPLE_DETAIL_MAP[id] || {
        meta: SAMPLE_CONVERSATIONS.find(c => c.id === id)!,
        steps: [],
        artifacts: [],
      };
    };
    handleSelectConversation(SAMPLE_CONVERSATIONS[0].id);
  };

  // Export Markdown
  const handleExportMarkdown = () => {
    if (!currentDetail) return;
    const { meta, steps } = currentDetail;

    let md = `# ${meta.title}\n\n`;
    md += `*Exported via AgyLens on ${new Date().toLocaleString()}*\n`;
    if (meta.workspaceUri) md += `*Workspace: \`${meta.workspaceUri}\`*\n`;
    md += `\n---\n\n`;

    for (const step of steps) {
      if (step.type === 'USER_INPUT') {
        md += `### 👤 ${step.userName || meta.userName || 'Developer'}\n\n${step.cleanUserPrompt || step.content}\n\n`;
      } else if (step.type === 'PLANNER_RESPONSE') {
        md += `### 🤖 Antigravity Agent\n\n`;
        if (step.thinking) {
          md += `> **Thinking Trace:**\n> ${step.thinking.replace(/\n/g, '\n> ')}\n\n`;
        }
        if (step.toolCalls && step.toolCalls.length > 0) {
          for (const tc of step.toolCalls) {
            md += `\`🛠️ [${tc.name}] ${tc.toolSummary || ''}\`\n`;
          }
          md += `\n`;
        }
        if (step.content) {
          md += `${step.content}\n\n`;
        }
      }
      md += `---\n\n`;
    }

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${meta.title.replace(/[^a-z0-9_-]/gi, '_')}_transcript.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Keyboard shortcut Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
        if (searchInput) searchInput.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div 
      className="flex flex-col h-screen w-screen overflow-hidden bg-[#0d0f12] text-gray-100 select-none"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={folderInputRef}
        onChange={handleFolderInputChange}
        {...({ webkitdirectory: '', directory: '', multiple: true } as any)}
        className="hidden"
      />
      <input
        type="file"
        ref={zipInputRef}
        onChange={handleZipInputChange}
        accept=".zip"
        className="hidden"
      />

      {/* Main Top Header */}
      <Header
        currentMeta={currentDetail?.meta}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        stats={stats}
        onOpenFolder={() => folderInputRef.current?.click()}
        onOpenZip={() => zipInputRef.current?.click()}
        onLoadDemo={handleLoadDemo}
        onExportMarkdown={currentDetail ? handleExportMarkdown : undefined}
      />

      {/* App Body */}
      <div className="flex-1 flex overflow-hidden relative">
        {conversations.length === 0 ? (
          <DropZoneOverlay
            isDragging={isDragging}
            isScanning={isScanning}
            onOpenFolder={() => folderInputRef.current?.click()}
            onOpenZip={() => zipInputRef.current?.click()}
            onLoadDemo={handleLoadDemo}
          />
        ) : (
          <>
            {/* Sidebar matching the Antigravity IDE sidebar */}
            <ConversationSidebar
              conversations={conversations}
              selectedId={selectedId}
              onSelect={handleSelectConversation}
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
              onOpenFolder={() => folderInputRef.current?.click()}
            />

            {/* Conversation Reader */}
            {currentDetail ? (
              <ConversationViewer detail={currentDetail} />
            ) : (
              <div className="flex-1 flex items-center justify-center text-sm text-gray-500">
                Select a conversation from the sidebar to view details.
              </div>
            )}

            {/* Drag Overlay when hovering while chats are already loaded */}
            {isDragging && (
              <div className="absolute inset-0 bg-blue-950/40 backdrop-blur-sm border-2 border-dashed border-blue-500 flex flex-col items-center justify-center z-50 pointer-events-none">
                <div className="p-6 rounded-2xl bg-[#141822] border border-blue-500/40 shadow-2xl text-center space-y-2">
                  <h3 className="text-base font-bold text-white">Drop to Ingest Conversations</h3>
                  <p className="text-xs text-blue-300">
                    AgyLens will auto-detect directories, annotations, and transcripts.
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
