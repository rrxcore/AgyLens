import { describe, it, expect } from 'vitest';
import { cleanUserPrompt, parseTranscript } from '../transcriptParser';

describe('transcriptParser', () => {
  it('cleanUserPrompt removes system wrapper tags correctly', () => {
    const raw = `<USER_REQUEST>\ndo you remeber my chatlens ?\n</USER_REQUEST>\n<ADDITIONAL_METADATA>\nThe current local time is: 2026-10-26T21:10:45+05:30.\n</ADDITIONAL_METADATA>`;
    expect(cleanUserPrompt(raw)).toBe('do you remeber my chatlens ?');
  });

  it('parses conversation steps including thinking and tool calls', () => {
    const jsonl = [
      JSON.stringify({
        step_index: 0,
        source: 'USER_EXPLICIT',
        type: 'USER_INPUT',
        status: 'DONE',
        created_at: '2026-10-26T15:40:45Z',
        content: '<USER_REQUEST>Fix the UI bug</USER_REQUEST>'
      }),
      JSON.stringify({
        step_index: 1,
        source: 'MODEL',
        type: 'PLANNER_RESPONSE',
        status: 'DONE',
        created_at: '2026-10-26T15:40:46Z',
        thinking: 'Looking for the bug in index.css',
        tool_calls: [
          {
            name: 'run_command',
            args: { CommandLine: 'npm test', toolSummary: 'Run UI test suite' }
          }
        ]
      }),
      JSON.stringify({
        step_index: 2,
        source: 'MODEL',
        type: 'GENERIC',
        status: 'DONE',
        created_at: '2026-10-26T15:40:48Z',
        content: 'Test passed'
      }),
      JSON.stringify({
        step_index: 3,
        source: 'MODEL',
        type: 'PLANNER_RESPONSE',
        status: 'DONE',
        created_at: '2026-10-26T15:40:50Z',
        content: 'I have verified that all UI tests are passing.'
      })
    ].join('\n');

    const result = parseTranscript(jsonl);
    expect(result.stepCount).toBe(4);
    expect(result.fallbackTitle).toBe('Fix the UI bug');
    expect(result.preview).toBe('Fix the UI bug');

    // Step 0 is user input
    expect(result.steps[0].type).toBe('USER_INPUT');
    expect(result.steps[0].cleanUserPrompt).toBe('Fix the UI bug');

    // Step 1 is model planner with thinking and tool calls
    expect(result.steps[1].type).toBe('PLANNER_RESPONSE');
    expect(result.steps[1].thinking).toBe('Looking for the bug in index.css');
    expect(result.steps[1].toolCalls?.[0].toolSummary).toBe('Run UI test suite');
    expect(result.steps[1].toolCalls?.[0].output).toBe('Test passed');

    // Step 2 is model final response
    expect(result.steps[2].content).toBe('I have verified that all UI tests are passing.');
  });
});
