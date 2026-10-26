import { describe, it, expect } from 'vitest';
import { processIngestedFiles, type VirtualFile } from '../smartScanner';

describe('smartScanner', () => {
  it('automatically correlates annotations and brain transcripts even if nested deeply', async () => {
    const uuid1 = '01122337-bca4-4f7f-b321-69c5396dadd9'; // archived
    const uuid2 = '02aa1f3c-8ad9-4d02-a2ec-cd17eadd0997'; // active

    const files: VirtualFile[] = [
      // Annotation 1: Archived
      {
        path: `antigravity/annotations/${uuid1}.pbtxt`,
        name: `${uuid1}.pbtxt`,
        size: 150,
        readText: async () => `title:"Troubleshooting Bluetooth Audio" archived:true last_user_view_time:{seconds:1789038725 nanos:845000000}`,
      },
      // Transcript 1
      {
        path: `antigravity/brain/${uuid1}/.system_generated/logs/transcript.jsonl`,
        name: 'transcript.jsonl',
        size: 200,
        readText: async () => JSON.stringify({
          step_index: 0,
          source: 'USER_EXPLICIT',
          type: 'USER_INPUT',
          content: '<USER_REQUEST>Bluetooth audio cuts out</USER_REQUEST>'
        }),
      },
      // Annotation 2: Active
      {
        path: `antigravity/annotations/${uuid2}.pbtxt`,
        name: `${uuid2}.pbtxt`,
        size: 150,
        readText: async () => `title:"GitHub Profile Redesign" last_user_view_time:{seconds:1791132118 nanos:901000000}`,
      },
      // Transcript 2
      {
        path: `antigravity/brain/${uuid2}/.system_generated/logs/transcript.jsonl`,
        name: 'transcript.jsonl',
        size: 200,
        readText: async () => JSON.stringify({
          step_index: 0,
          source: 'USER_EXPLICIT',
          type: 'USER_INPUT',
          content: '<USER_REQUEST>Make a cool GitHub profile</USER_REQUEST>'
        }),
      },
      // Artifact 2
      {
        path: `antigravity/brain/${uuid2}/walkthrough.md`,
        name: 'walkthrough.md',
        size: 300,
        readText: async () => '# Walkthrough: Profile Design',
      }
    ];

    const result = await processIngestedFiles(files);
    expect(result.stats.totalScanned).toBe(2);
    expect(result.stats.activeCount).toBe(1);
    expect(result.stats.archivedCount).toBe(1);

    const archivedConv = result.conversations.find(c => c.id === uuid1);
    expect(archivedConv?.title).toBe('Troubleshooting Bluetooth Audio');
    expect(archivedConv?.isArchived).toBe(true);

    const activeConv = result.conversations.find(c => c.id === uuid2);
    expect(activeConv?.title).toBe('GitHub Profile Redesign');
    expect(activeConv?.isArchived).toBe(false);
    expect(activeConv?.artifactsCount).toBe(1);

    // Test detail loader
    const detail = await result.loadConversationDetail(uuid2);
    expect(detail.steps.length).toBe(1);
    expect(detail.steps[0].cleanUserPrompt).toBe('Make a cool GitHub profile');
    expect(detail.artifacts.length).toBe(1);
    expect(detail.artifacts[0].name).toBe('walkthrough.md');
  });
});
