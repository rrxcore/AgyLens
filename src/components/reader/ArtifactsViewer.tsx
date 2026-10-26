import React, { useState } from 'react';
import { FileText, Copy, Check, Download, Layers } from 'lucide-react';
import type { ArtifactItem } from '../../types/antigravity';
import { MarkdownRenderer } from './MarkdownRenderer';

interface ArtifactsViewerProps {
  artifacts: ArtifactItem[];
}

export const ArtifactsViewer: React.FC<ArtifactsViewerProps> = ({ artifacts }) => {
  const [selectedArtifactId, setSelectedArtifactId] = useState<string>(
    artifacts[0]?.id || ''
  );
  const [copied, setCopied] = useState(false);

  const selectedArtifact = artifacts.find(a => a.id === selectedArtifactId) || artifacts[0];

  const handleCopy = () => {
    if (selectedArtifact) {
      navigator.clipboard.writeText(selectedArtifact.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (selectedArtifact) {
      const blob = new Blob([selectedArtifact.content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = selectedArtifact.name;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  if (artifacts.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-500">
        <FileText className="w-12 h-12 mb-3 text-gray-600" />
        <p className="text-sm font-medium">No artifacts were generated in this session.</p>
        <p className="text-xs text-gray-600 mt-1">Artifacts include walkthroughs, architecture plans, and code diffs.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex h-full overflow-hidden bg-[#101217]">
      {/* Artifacts List Sidebar */}
      <div className="w-64 border-r border-white/10 flex flex-col bg-[#14171d]/60">
        <div className="p-3 border-b border-white/5 text-xs font-semibold text-gray-300 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-indigo-400" />
          <span>Session Artifacts ({artifacts.length})</span>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {artifacts.map((art) => {
            const isSelected = art.id === selectedArtifact?.id;
            return (
              <button
                key={art.id}
                onClick={() => setSelectedArtifactId(art.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center gap-2 transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <FileText className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate font-mono">{art.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Artifact Content Preview */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {selectedArtifact ? (
          <>
            <div className="h-12 border-b border-white/10 px-4 flex items-center justify-between bg-[#161a22]/50">
              <span className="text-xs font-mono font-medium text-gray-200">
                {selectedArtifact.name}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-xs text-gray-300 hover:text-white px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors"
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
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1 text-xs text-gray-300 hover:text-white px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <Download className="w-3 h-3" />
                  <span>Download</span>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto w-full">
              <MarkdownRenderer content={selectedArtifact.content} />
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};
