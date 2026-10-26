import { describe, it, expect } from 'vitest';
import { parsePbtxtAnnotation } from '../pbtxtParser';

describe('parsePbtxtAnnotation', () => {
  it('parses standard annotation with title, archived, and timestamp', () => {
    const raw = `title:"Troubleshooting Bluetooth Audio Quality" archived:true archival_status_timestamp:{seconds:1789038724 nanos:659995800} last_user_view_time:{seconds:1789038725 nanos:845000000}`;
    const result = parsePbtxtAnnotation(raw, '01122337-bca4-4f7f-b321-69c5396dadd9.pbtxt');

    expect(result.id).toBe('01122337-bca4-4f7f-b321-69c5396dadd9');
    expect(result.title).toBe('Troubleshooting Bluetooth Audio Quality');
    expect(result.isArchived).toBe(true);
    expect(result.isPinned).toBe(false);
    expect(result.archivalTimestamp).toBe(1789038724);
    expect(result.lastViewTimestamp).toBe(1789038725);
  });

  it('parses pinned annotation', () => {
    const raw = `title:"Project Plan" pinned:true last_user_view_time:{seconds:1790000000 nanos:100}`;
    const result = parsePbtxtAnnotation(raw, 'abc-123.pbtxt');

    expect(result.id).toBe('abc-123');
    expect(result.title).toBe('Project Plan');
    expect(result.isArchived).toBe(false);
    expect(result.isPinned).toBe(true);
  });

  it('handles empty or missing title gracefully', () => {
    const raw = `archived:true archival_status_timestamp:{seconds:1793029120 nanos:285135300}`;
    const result = parsePbtxtAnnotation(raw, 'empty-title.pbtxt');

    expect(result.id).toBe('empty-title');
    expect(result.title).toBeUndefined();
    expect(result.isArchived).toBe(true);
  });
});
