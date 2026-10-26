export interface ParsedAnnotation {
  id: string;
  title?: string;
  isArchived: boolean;
  isPinned: boolean;
  archivalTimestamp?: number;
  lastViewTimestamp?: number;
}

export function parsePbtxtAnnotation(content: string, filename: string): ParsedAnnotation {
  const id = filename.replace(/\.pbtxt$/i, '').trim();

  // Extract title: title:"..." or title: "..."
  const titleMatch = content.match(/title\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/);
  const title = titleMatch ? titleMatch[1].replace(/\\"/g, '"') : undefined;

  // Extract archived:true
  const isArchived = /archived\s*:\s*true/i.test(content);

  // Extract pinned:true
  const isPinned = /pinned\s*:\s*true/i.test(content);

  // Extract archival timestamp
  const archivalMatch = content.match(/archival_status_timestamp\s*:\s*\{\s*seconds\s*:\s*(\d+)/i);
  const archivalTimestamp = archivalMatch ? parseInt(archivalMatch[1], 10) : undefined;

  // Extract last view timestamp
  const lastViewMatch = content.match(/last_user_view_time\s*:\s*\{\s*seconds\s*:\s*(\d+)/i);
  const lastViewTimestamp = lastViewMatch ? parseInt(lastViewMatch[1], 10) : undefined;

  return {
    id,
    title,
    isArchived,
    isPinned,
    archivalTimestamp,
    lastViewTimestamp,
  };
}
