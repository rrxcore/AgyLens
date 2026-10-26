import JSZip from 'jszip';
import type { ArtifactItem, ConversationDetail, ConversationMeta, MessageStep } from '../types/antigravity';
import { parsePbtxtAnnotation, type ParsedAnnotation } from './pbtxtParser';
import { formatRelativeTime, parseTranscript } from './transcriptParser';

export interface VirtualFile {
  path: string;
  name: string;
  size: number;
  readText: () => Promise<string>;
}

const UUID_REGEX = /([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/i;

/**
 * Recursively scans FileSystemEntry from Drag & Drop
 */
export async function scanEntryRecursive(entry: any, basePath = ''): Promise<VirtualFile[]> {
  const files: VirtualFile[] = [];

  if (entry.isFile) {
    const file = await new Promise<File>((resolve, reject) => entry.file(resolve, reject));
    const fullPath = basePath ? `${basePath}/${entry.name}` : entry.name;
    files.push({
      path: fullPath.replace(/\\/g, '/'),
      name: entry.name,
      size: file.size,
      readText: () => file.text(),
    });
  } else if (entry.isDirectory) {
    const dirReader = entry.createReader();
    const readAllEntries = async (): Promise<any[]> => {
      const all: any[] = [];
      let batch: any[];
      do {
        batch = await new Promise<any[]>((resolve, reject) => dirReader.readEntries(resolve, reject));
        all.push(...batch);
      } while (batch.length > 0);
      return all;
    };

    const entries = await readAllEntries();
    const nextPath = basePath ? `${basePath}/${entry.name}` : entry.name;
    for (const child of entries) {
      const childFiles = await scanEntryRecursive(child, nextPath);
      files.push(...childFiles);
    }
  }

  return files;
}

/**
 * Extracts VirtualFiles from dropped dataTransfer items (folders or files)
 */
export async function getFilesFromDataTransfer(dataTransfer: DataTransfer): Promise<VirtualFile[]> {
  const files: VirtualFile[] = [];
  const items = dataTransfer.items;

  // 1. Check if user dropped a .zip file directly
  if (dataTransfer.files.length === 1 && dataTransfer.files[0].name.toLowerCase().endsWith('.zip')) {
    return extractFilesFromZip(dataTransfer.files[0]);
  }

  // 2. Use webkitGetAsEntry if supported for directories
  if (items && items.length > 0 && typeof items[0].webkitGetAsEntry === 'function') {
    for (let i = 0; i < items.length; i++) {
      const entry = items[i].webkitGetAsEntry();
      if (entry) {
        const entryFiles = await scanEntryRecursive(entry);
        files.push(...entryFiles);
      }
    }
    if (files.length > 0) return files;
  }

  // 3. Fallback to standard files array
  for (let i = 0; i < dataTransfer.files.length; i++) {
    const file = dataTransfer.files[i];
    if (file.name.toLowerCase().endsWith('.zip')) {
      const zipFiles = await extractFilesFromZip(file);
      files.push(...zipFiles);
    } else {
      files.push({
        path: (file as any).webkitRelativePath || file.name,
        name: file.name,
        size: file.size,
        readText: () => file.text(),
      });
    }
  }

  return files;
}

/**
 * Unzips in-memory using JSZip and creates VirtualFiles
 */
export async function extractFilesFromZip(zipFile: File | Blob): Promise<VirtualFile[]> {
  const zip = await JSZip.loadAsync(zipFile);
  const virtualFiles: VirtualFile[] = [];

  zip.forEach((relativePath, zipEntry) => {
    if (!zipEntry.dir) {
      virtualFiles.push({
        path: relativePath.replace(/\\/g, '/'),
        name: zipEntry.name.split('/').pop() || zipEntry.name,
        size: 0,
        readText: () => zipEntry.async('string'),
      });
    }
  });

  return virtualFiles;
}

export interface IngestionResult {
  conversations: ConversationMeta[];
  loadConversationDetail: (id: string) => Promise<ConversationDetail>;
  stats: {
    totalScanned: number;
    activeCount: number;
    archivedCount: number;
    pinnedCount: number;
  };
}

/**
 * Core Smart Signature Matcher:
 * Automatically normalizes any dropped path (Root Antigravity, Brain folder, Single Chat, or Zip)
 * and resolves everything to its rightful place ("khud ke jagah pe khud ajayega")!
 */
export async function processIngestedFiles(virtualFiles: VirtualFile[]): Promise<IngestionResult> {
  const annotationsMap = new Map<string, ParsedAnnotation>();
  const transcriptsMap = new Map<string, VirtualFile>();
  const artifactsMap = new Map<string, VirtualFile[]>();

  // 1. Segregate files by role regardless of folder depth
  for (const file of virtualFiles) {
    const normalizedPath = file.path.replace(/\\/g, '/');

    // A. Is it an annotation .pbtxt?
    if (normalizedPath.endsWith('.pbtxt')) {
      const uuidMatch = normalizedPath.match(UUID_REGEX);
      const convId = uuidMatch ? uuidMatch[1] : file.name.replace(/\.pbtxt$/i, '');
      try {
        const text = await file.readText();
        const annotation = parsePbtxtAnnotation(text, file.name);
        annotationsMap.set(convId, annotation);
      } catch (err) {
        console.warn('Failed parsing annotation:', file.path, err);
      }
      continue;
    }

    // B. Is it a transcript?
    if (normalizedPath.endsWith('transcript.jsonl') || normalizedPath.endsWith('transcript_full.jsonl')) {
      const uuidMatch = normalizedPath.match(UUID_REGEX);
      const convId = uuidMatch ? uuidMatch[1] : (normalizedPath.split('/').slice(-3)[0] || 'single-session');
      // Prefer transcript.jsonl over transcript_full.jsonl for fast index, unless only full exists
      if (!transcriptsMap.has(convId) || normalizedPath.endsWith('transcript.jsonl')) {
        transcriptsMap.set(convId, file);
      }
      continue;
    }

    // C. Is it an artifact markdown file? (e.g. brain/<uuid>/plan.md or walkthrough.md)
    if (normalizedPath.endsWith('.md') && !normalizedPath.includes('.system_generated')) {
      const uuidMatch = normalizedPath.match(UUID_REGEX);
      if (uuidMatch) {
        const convId = uuidMatch[1];
        if (!artifactsMap.has(convId)) artifactsMap.set(convId, []);
        artifactsMap.get(convId)!.push(file);
      }
    }
  }

  // 2. Aggregate all detected conversation IDs
  const allIds = new Set<string>([
    ...Array.from(transcriptsMap.keys()),
    ...Array.from(annotationsMap.keys()),
  ]);

  const conversations: ConversationMeta[] = [];

  for (const id of allIds) {
    const annotation = annotationsMap.get(id);
    const transcriptFile = transcriptsMap.get(id);
    const artifacts = artifactsMap.get(id) || [];

    let title = annotation?.title || '';
    let preview = '';
    let stepCount = 0;
    let lastTime = new Date().toISOString();

    // If we have a transcript file, read the first few lines to get fast title/preview/timestamp
    if (transcriptFile) {
      try {
        // Read transcript to extract basic metadata
        const text = await transcriptFile.readText();
        const parsed = parseTranscript(text);
        stepCount = parsed.stepCount;
        preview = parsed.preview;
        lastTime = parsed.lastTimestamp;
        if (!title) {
          title = parsed.fallbackTitle;
        }
      } catch (err) {
        console.warn('Error reading fast transcript metadata:', err);
      }
    }

    if (!title) {
      title = `Conversation ${id.slice(0, 8)}`;
    }

    const isArchived = Boolean(annotation?.isArchived);
    const isPinned = Boolean(annotation?.isPinned);

    // Compute relative time string (e.g. '18m', '3h', '2d')
    const timestampToUse = annotation?.lastViewTimestamp 
      ? annotation.lastViewTimestamp 
      : lastTime;
    const relativeTimeStr = formatRelativeTime(timestampToUse);

    // Running indicator: if last view or last update was within past 30 mins and not archived
    const nowSec = Math.floor(Date.now() / 1000);
    const timeSec = typeof timestampToUse === 'number' 
      ? timestampToUse 
      : Math.floor(new Date(timestampToUse).getTime() / 1000);
    const isRunning = !isArchived && (nowSec - timeSec < 3600);

    conversations.push({
      id,
      title,
      preview,
      stepCount,
      isArchived,
      isPinned,
      isRunning,
      lastModifiedTime: typeof timestampToUse === 'number' ? new Date(timestampToUse * 1000).toISOString() : lastTime,
      relativeTimeStr,
      artifactsCount: artifacts.length,
      transcriptPath: transcriptFile?.path,
    });
  }

  // 3. Sort conversations: Pinned first, then newest first
  conversations.sort((a, b) => {
    if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
    return new Date(b.lastModifiedTime).getTime() - new Date(a.lastModifiedTime).getTime();
  });

  // 4. Detail Loader function
  const loadConversationDetail = async (id: string): Promise<ConversationDetail> => {
    const meta = conversations.find(c => c.id === id) || {
      id,
      title: 'Conversation',
      stepCount: 0,
      isArchived: false,
      isPinned: false,
      lastModifiedTime: new Date().toISOString(),
      relativeTimeStr: 'Just now',
      artifactsCount: 0,
    };

    let steps: MessageStep[] = [];
    const transcriptFile = transcriptsMap.get(id);
    if (transcriptFile) {
      const text = await transcriptFile.readText();
      const parsed = parseTranscript(text);
      steps = parsed.steps;
    }

    const artifactItems: ArtifactItem[] = [];
    const rawArtifacts = artifactsMap.get(id) || [];
    for (const af of rawArtifacts) {
      try {
        const content = await af.readText();
        artifactItems.push({
          id: af.name,
          name: af.name,
          path: af.path,
          content,
          isUserFacing: true,
        });
      } catch (err) {
        console.warn('Failed reading artifact:', af.path, err);
      }
    }

    return {
      meta,
      steps,
      artifacts: artifactItems,
    };
  };

  const archivedCount = conversations.filter(c => c.isArchived).length;
  const pinnedCount = conversations.filter(c => c.isPinned).length;
  const activeCount = conversations.length - archivedCount;

  return {
    conversations,
    loadConversationDetail,
    stats: {
      totalScanned: conversations.length,
      activeCount,
      archivedCount,
      pinnedCount,
    },
  };
}
