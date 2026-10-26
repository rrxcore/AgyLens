import type { MessageStep, ToolCall } from '../types/antigravity';

export function cleanUserPrompt(rawContent?: string): string {
  if (!rawContent) return '';
  
  // Extract text within <USER_REQUEST>...</USER_REQUEST>
  const match = rawContent.match(/<USER_REQUEST>([\s\S]*?)<\/USER_REQUEST>/i);
  if (match) {
    return match[1].trim();
  }

  // Fallback: strip tags like <ADDITIONAL_METADATA>, <USER_SETTINGS_CHANGE>, <IMAGE_ANALYSIS>
  return rawContent
    .replace(/<ADDITIONAL_METADATA>[\s\S]*?<\/ADDITIONAL_METADATA>/gi, '')
    .replace(/<USER_SETTINGS_CHANGE>[\s\S]*?<\/USER_SETTINGS_CHANGE>/gi, '')
    .replace(/<[^>]+>/g, '')
    .trim();
}

export function formatRelativeTime(dateInput: string | Date | number): string {
  const date = typeof dateInput === 'number' 
    ? new Date(dateInput * (dateInput < 1e11 ? 1000 : 1)) 
    : new Date(dateInput);

  if (isNaN(date.getTime())) return '';

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 30) return `${diffDays}d`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function parseTranscript(jsonlContent: string): {
  steps: MessageStep[];
  stepCount: number;
  preview: string;
  fallbackTitle: string;
  lastTimestamp: string;
} {
  const lines = jsonlContent.split(/\r?\n/).filter(line => line.trim().length > 0);
  const rawSteps: any[] = [];

  for (const line of lines) {
    try {
      rawSteps.push(JSON.parse(line));
    } catch {
      // skip invalid lines if partially written
    }
  }

  const steps: MessageStep[] = [];
  let pendingToolCalls: ToolCall[] = [];
  let fallbackTitle = 'Untitled Conversation';
  let preview = '';
  let lastTimestamp = new Date().toISOString();

  for (let i = 0; i < rawSteps.length; i++) {
    const raw = rawSteps[i];
    if (raw.created_at) {
      lastTimestamp = raw.created_at;
    }

    if (raw.type === 'USER_INPUT') {
      const prompt = cleanUserPrompt(raw.content);
      if (!preview && prompt) {
        preview = prompt.slice(0, 150);
      }
      if (fallbackTitle === 'Untitled Conversation' && prompt) {
        fallbackTitle = prompt.slice(0, 45).replace(/[\r\n]+/g, ' ').trim();
      }

      steps.push({
        stepIndex: raw.step_index ?? i,
        source: raw.source || 'USER_EXPLICIT',
        type: 'USER_INPUT',
        status: raw.status || 'DONE',
        createdAt: raw.created_at || lastTimestamp,
        content: raw.content,
        cleanUserPrompt: prompt,
        media: raw.media,
      });
      continue;
    }

    if (raw.type === 'PLANNER_RESPONSE') {
      const calls: ToolCall[] = [];
      if (Array.isArray(raw.tool_calls)) {
        for (const tc of raw.tool_calls) {
          calls.push({
            name: tc.name,
            args: tc.args || {},
            toolSummary: tc.args?.toolSummary?.replace(/^"|"$/g, '') || tc.name,
            status: 'DONE',
          });
        }
      }

      // Check if subsequent step is GENERIC (tool output) and associate outputs
      pendingToolCalls = calls;

      steps.push({
        stepIndex: raw.step_index ?? i,
        source: raw.source || 'MODEL',
        type: 'PLANNER_RESPONSE',
        status: raw.status || 'DONE',
        createdAt: raw.created_at || lastTimestamp,
        content: raw.content,
        thinking: raw.thinking,
        toolCalls: calls.length > 0 ? calls : undefined,
      });
      continue;
    }

    if (raw.type === 'GENERIC' && pendingToolCalls.length > 0) {
      // Associate output with the most recent tool call
      const lastCall = pendingToolCalls[pendingToolCalls.length - 1];
      if (lastCall && !lastCall.output) {
        lastCall.output = raw.content;
      }
    }

    // Optionally include system notifications if user toggles them
    if (raw.type === 'EPHEMERAL_MESSAGE' || raw.source === 'SYSTEM_SDK') {
      steps.push({
        stepIndex: raw.step_index ?? i,
        source: raw.source,
        type: raw.type,
        status: raw.status || 'DONE',
        createdAt: raw.created_at || lastTimestamp,
        content: raw.content,
      });
    }
  }

  return {
    steps,
    stepCount: rawSteps.length,
    preview,
    fallbackTitle,
    lastTimestamp,
  };
}
