import type { ConversationDetail, ConversationMeta } from '../types/antigravity';

export const SAMPLE_CONVERSATIONS: ConversationMeta[] = [
  {
    id: 'demo-1-voice-calc',
    title: 'Cross-Platform Voice Calculator',
    preview: 'Build a high-performance voice calculator using Web Audio API and SpeechRecognition',
    stepCount: 24,
    isArchived: false,
    isPinned: true,
    isRunning: true,
    lastModifiedTime: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
    relativeTimeStr: '18m',
    workspaceUri: 'C:/Users/rrxcore/Projects/VoiceCalc',
    artifactsCount: 2,
  },
  {
    id: 'demo-2-chatlens',
    title: 'Recalling Past Chat Details',
    preview: 'ChatLens architecture inspection and WhatsApp export parsing',
    stepCount: 16,
    isArchived: false,
    isPinned: false,
    isRunning: false,
    lastModifiedTime: new Date(Date.now() - 53 * 60 * 1000).toISOString(),
    relativeTimeStr: '53m',
    workspaceUri: 'C:/HOST-RR/ChatLens',
    artifactsCount: 1,
  },
  {
    id: 'demo-3-pdf-gen',
    title: 'Generating PDFs Using Code',
    preview: 'Automating high-resolution multi-page PDF generation with Puppeteer and canvas',
    stepCount: 32,
    isArchived: false,
    isPinned: false,
    isRunning: false,
    lastModifiedTime: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    relativeTimeStr: '3h',
    workspaceUri: 'C:/Users/rrxcore/Projects/PDFGen',
    artifactsCount: 3,
  },
  {
    id: 'demo-4-viva-prep',
    title: 'PCA 2 Viva Questions Preparation',
    preview: 'Key questions and answers for Principal Component Analysis in Machine Learning',
    stepCount: 12,
    isArchived: false,
    isPinned: false,
    isRunning: false,
    lastModifiedTime: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    relativeTimeStr: '5h',
    artifactsCount: 1,
  },
  {
    id: 'demo-archive-1-bluetooth',
    title: 'Troubleshooting Bluetooth Audio Quality',
    preview: 'Diagnosing LDAC and AptX codec stutter on Windows 11 with Voicemeeter Potato',
    stepCount: 28,
    isArchived: true,
    isPinned: false,
    isRunning: false,
    lastModifiedTime: new Date(Date.now() - 2 * 86400 * 1000).toISOString(),
    relativeTimeStr: '2d',
    artifactsCount: 2,
  },
  {
    id: 'demo-archive-2-scripting',
    title: 'YT VIDEO SCRIPTING — Tech Explainer',
    preview: 'Drafting 12-minute YouTube video script on AI coding agents and LLM tool calling',
    stepCount: 42,
    isArchived: true,
    isPinned: false,
    isRunning: false,
    lastModifiedTime: new Date(Date.now() - 4 * 86400 * 1000).toISOString(),
    relativeTimeStr: '4d',
    artifactsCount: 1,
  },
  {
    id: 'demo-archive-3-shutdown',
    title: 'Scheduled Shutdown Automation',
    preview: 'PowerShell script to automatically shutdown system after active renders complete',
    stepCount: 8,
    isArchived: true,
    isPinned: false,
    isRunning: false,
    lastModifiedTime: new Date(Date.now() - 7 * 86400 * 1000).toISOString(),
    relativeTimeStr: '7d',
    artifactsCount: 1,
  },
];

export const SAMPLE_DETAIL_MAP: Record<string, ConversationDetail> = {
  'demo-1-voice-calc': {
    meta: SAMPLE_CONVERSATIONS[0],
    artifacts: [
      {
        id: 'voice_calc_architecture.md',
        name: 'voice_calc_architecture.md',
        path: 'brain/demo-1-voice-calc/voice_calc_architecture.md',
        content: `# Voice Calculator Architecture\n\n- **Engine**: Web Audio API + SpeechRecognition API\n- **Math Parser**: Shunting-Yard expression evaluator\n- **TTS Feedback**: Web Speech Synthesis with natural inflection.`,
        isUserFacing: true,
      },
      {
        id: 'walkthrough.md',
        name: 'walkthrough.md',
        path: 'brain/demo-1-voice-calc/walkthrough.md',
        content: `# Walkthrough\n\n1. Initialized audio stream listener\n2. Bound speech tokens to numeric operations\n3. Tested 10 viva edge cases.`,
        isUserFacing: true,
      }
    ],
    steps: [
      {
        stepIndex: 0,
        source: 'USER_EXPLICIT',
        type: 'USER_INPUT',
        status: 'DONE',
        createdAt: '2026-10-26T15:10:00Z',
        cleanUserPrompt: 'I want to build a cross-platform voice calculator that can listen to spoken math expressions like "forty-two times seventy-five" and calculate it with zero latency.',
        content: 'I want to build a cross-platform voice calculator that can listen to spoken math expressions like "forty-two times seventy-five" and calculate it with zero latency.',
      },
      {
        stepIndex: 1,
        source: 'MODEL',
        type: 'PLANNER_RESPONSE',
        status: 'DONE',
        createdAt: '2026-10-26T15:10:03Z',
        thinking: `The user wants a voice-driven calculator with high accuracy and low latency.
1. Evaluate Web Speech API vs Whisper local WASM.
2. Design a Tokenizer that maps words ('times', 'multiplied by', 'divided by', 'plus', 'square root of') to standard math symbols.
3. Use a Shunting-Yard parser to handle operator precedence (PEMDAS) correctly without 'eval()'.
Let's check if the workspace has existing audio dependencies.`,
        toolCalls: [
          {
            name: 'run_command',
            toolSummary: 'Check local audio libraries and node packages',
            args: { CommandLine: 'npm list --depth=0' },
            output: `+-- @types/node@24.13.3\n+-- react@19.2.8\n+-- tailwindcss@4.3.3`,
            status: 'DONE',
          }
        ],
        content: `Here is the architectural blueprint for your **Cross-Platform Voice Calculator**:

### 🎙️ 1. Audio & Speech Recognition Pipeline
* **Engine**: Browser-native \`webkitSpeechRecognition\` / \`SpeechRecognition\` with continuous listening and intermediate results.
* **Token Normalizer**: Converts verbal number words (*"twenty five"*, *"negative six"*, *"point five"*) to decimal digits (\`25\`, \`-6\`, \`0.5\`).

### 🧮 2. Safe Mathematical Expression Parser
Instead of using unsafe \`eval()\`, we implement Dijkstra's **Shunting-Yard Algorithm** into an Abstract Syntax Tree (AST):

\`\`\`typescript
// Math Tokenizer Definition
export type TokenType = 'NUMBER' | 'OPERATOR' | 'PAREN_OPEN' | 'PAREN_CLOSE' | 'FUNCTION';

export interface Token {
  type: TokenType;
  value: string | number;
  precedence?: number;
}
\`\`\`

All audio computation runs 100% locally with immediate visual feedback!`,
      },
      {
        stepIndex: 2,
        source: 'USER_EXPLICIT',
        type: 'USER_INPUT',
        status: 'DONE',
        createdAt: '2026-10-26T15:12:30Z',
        cleanUserPrompt: 'can you add a wave animation visualization that pulses when I speak?',
        content: 'can you add a wave animation visualization that pulses when I speak?',
      },
      {
        stepIndex: 3,
        source: 'MODEL',
        type: 'PLANNER_RESPONSE',
        status: 'DONE',
        createdAt: '2026-10-26T15:12:33Z',
        thinking: `User wants a real-time reactive audio visualizer.
1. Hook into \`navigator.mediaDevices.getUserMedia({ audio: true })\`.
2. Create \`AudioContext\` and \`AnalyserNode\`.
3. Read \`getByteFrequencyData\` inside a \`requestAnimationFrame\` loop.
4. Render 5 reactive glowing neon bars or smooth canvas wave.`,
        toolCalls: [
          {
            name: 'write_file',
            toolSummary: 'Create AudioWaveform visualizer component',
            args: { Path: 'src/components/AudioWaveform.tsx' },
            output: 'Created file successfully.',
            status: 'DONE',
          }
        ],
        content: `I've implemented the **reactive neon audio visualizer**!

\`\`\`tsx
export function AudioWaveform({ isListening }: { isListening: boolean }) {
  return (
    <div className="flex items-center justify-center gap-1.5 h-12">
      {[1, 2, 3, 4, 5].map((bar) => (
        <span
          key={bar}
          className={clsx(
            "w-1.5 bg-gradient-to-t from-emerald-500 to-cyan-400 rounded-full transition-all duration-150",
            isListening ? "animate-pulse h-8" : "h-2 opacity-40"
          )}
        />
      ))}
    </div>
  );
}
\`\`\`

The waveform smoothly amplifies based on microphone input and relaxes when you are silent.`,
      }
    ]
  }
};
