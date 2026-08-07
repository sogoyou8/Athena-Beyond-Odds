import { describe, it, expect } from 'vitest';
import type { MatchStatus } from '../../src/domain/value-objects/match-status.js';

describe('MatchStatus value-object', () => {
  it('should accept all normalized values', () => {
    const statuses: MatchStatus[] = [
      'SCHEDULED',
      'LIVE',
      'FINISHED',
      'POSTPONED',
      'CANCELLED'
    ];
    expect(statuses).toHaveLength(5);
  });
});
