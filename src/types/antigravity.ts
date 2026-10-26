export interface ToolCall {
  name: string;
  args: Record<string, any>;
  toolSummary?: string;
  output?: string;
  status?: string;
}

export interface ConversationMeta {
  id: string;
  title: string;
  preview?: string;
  stepCount: number;
  isArchived: boolean;
  isPinned: boolean;
  isRunning?: boolean;
  lastModifiedTime: string;
  relativeTimeStr: string;
  workspaceUri?: string;
  artifactsCount: number;
  transcriptPath?: string;
  annotationPath?: string;
}

export interface MessageStep {
  stepIndex: number;
  source: 'USER_EXPLICIT' | 'MODEL' | 'SYSTEM' | 'SYSTEM_SDK' | string;
  type: 'USER_INPUT' | 'PLANNER_RESPONSE' | 'GENERIC' | 'EPHEMERAL_MESSAGE' | string;
  status: string;
  createdAt: string;
  content?: string;
  cleanUserPrompt?: string;
  thinking?: string;
  toolCalls?: ToolCall[];
  media?: { mime_type: string; uri: string }[];
}

export interface ArtifactItem {
  id: string;
  name: string;
  path: string;
  content: string;
  summary?: string;
  isUserFacing?: boolean;
}

export interface ConversationDetail {
  meta: ConversationMeta;
  steps: MessageStep[];
  artifacts: ArtifactItem[];
}

export type ActiveFilterTab = 'all' | 'active' | 'pinned' | 'archived';
