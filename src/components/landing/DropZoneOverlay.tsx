import React from 'react';
import { 
  FolderDown, 
  Archive, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  FolderOpen 
} from 'lucide-react';

interface DropZoneOverlayProps {
  isDragging: boolean;
  isScanning: boolean;
  onOpenFolder: () => void;
  onOpenZip: () => void;
  onLoadDemo: () => void;
}

export const DropZoneOverlay: React.FC<DropZoneOverlayProps> = ({
  isDragging,
  isScanning,
  onOpenFolder,
  onOpenZip,
  onLoadDemo,
}) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[#0c0e12] select-none relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute w-96 h-96 rounded-full bg-blue-600/10 blur-[100px] pointer-events-none -top-20 -left-20" />
      <div className="absolute w-96 h-96 rounded-full bg-purple-600/10 blur-[100px] pointer-events-none -bottom-20 -right-20" />

      {/* Center Landing / Drag Card */}
      <div className={`relative max-w-xl w-full p-8 md:p-10 rounded-2xl border transition-all duration-300 text-center ${
        isDragging 
          ? 'border-blue-500 bg-blue-950/20 shadow-2xl shadow-blue-500/20 scale-[1.02]' 
          : 'border-white/10 bg-[#13161c]/80 backdrop-blur-xl shadow-xl'
      }`}>
        {isScanning ? (
          <div className="py-8 space-y-4">
            <div className="w-12 h-12 rounded-full border-3 border-blue-500 border-t-transparent animate-spin mx-auto" />
            <h3 className="text-base font-semibold text-white">Scanning Conversations...</h3>
            <p className="text-xs text-gray-400">
              Correlating SQLite summaries, `.pbtxt` annotations, and `.jsonl` transcripts...
            </p>
          </div>
        ) : (
          <>
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-blue-500/25">
              <FolderDown className="w-8 h-8 text-white animate-bounce" />
            </div>

            <h2 className="text-xl md:text-2xl font-bold text-white mb-2 tracking-tight">
              Drag & Drop Your Antigravity Chats
            </h2>

            <p className="text-xs md:text-sm text-gray-400 mb-6 max-w-md mx-auto leading-relaxed">
              Drop your <code className="text-blue-300 bg-blue-950/50 px-1 py-0.5 rounded">.gemini/antigravity</code> folder,
              a <code className="text-purple-300 bg-purple-950/50 px-1 py-0.5 rounded">brain/</code> folder, a single conversation, or a <code className="text-indigo-300 bg-indigo-950/50 px-1 py-0.5 rounded">.zip</code>.
              <br />
              <strong className="text-gray-300">AgyLens auto-detects everything</strong> and separates active, pinned, and archived chats automatically!
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
              <button
                onClick={onOpenFolder}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-lg shadow-blue-600/30 transition-all cursor-pointer active:scale-95"
              >
                <FolderOpen className="w-4 h-4" />
                <span>Select Folder</span>
              </button>

              <button
                onClick={onOpenZip}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 font-medium text-xs transition-all cursor-pointer active:scale-95"
              >
                <Archive className="w-4 h-4 text-purple-400" />
                <span>Upload ZIP</span>
              </button>

              <button
                onClick={onLoadDemo}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600/20 to-purple-600/20 hover:from-indigo-600/30 hover:to-purple-600/30 border border-indigo-500/30 text-indigo-300 font-medium text-xs transition-all cursor-pointer active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Try Demo Chat</span>
              </button>
            </div>

            {/* Privacy & Highlights */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-white/5 text-left">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>100% Local</span>
                </div>
                <p className="text-[11px] text-gray-500 leading-tight">
                  Zero server uploads. Runs completely in browser memory.
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-400">
                  <Archive className="w-3.5 h-3.5" />
                  <span>Archive Section</span>
                </div>
                <p className="text-[11px] text-gray-500 leading-tight">
                  Recovers and displays all your archived sessions cleanly.
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-400">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Full Inspector</span>
                </div>
                <p className="text-[11px] text-gray-500 leading-tight">
                  Thinking traces, tool executions, and artifacts in one place.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
