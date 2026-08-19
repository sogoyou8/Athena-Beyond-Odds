/**
 * Tests unitaires — FormCalculator (DEC-019).
 */

import { describe, it, expect } from 'vitest';
import { FormCalculator } from '../../src/domain/services/form-calculator.js';
import { Match } from '../../src/domain/entities/match.js';
import { MatchStatus } from '../../src/domain/value-objects/match-status.js';
import { Team } from '../../src/domain/entities/team.js';

const TEAM_A: Team = {
  id: 'team-a',
  name: 'Team A',
  shortName: 'A',
  tla: 'TMA',
  crestUrl: null,
  providerMetadata: { providerName: 'test', externalId: 'a', lastUpdated: new Date() },
};

const TEAM_B: Team = {
  id: 'team-b',
  name: 'Team B',
  shortName: 'B',
  tla: 'TMB',
  crestUrl: null,
  providerMetadata: { providerName: 'test', externalId: 'b', lastUpdated: new Date() },
};

const TEAM_C: Team = {
  id: 'team-c',
  name: 'Team C',
  shortName: 'C',
  tla: 'TMC',
  crestUrl: null,
  providerMetadata: { providerName: 'test', externalId: 'c', lastUpdated: new Date() },
};

const TARGET_DATE = new Date('2026-08-15T20:00:00.000Z');
const COMP_ID = 'FL1';
const SEASON_ID = 'season-2026';

function createMatch(
  id: string,
  dateStr: string,
  home: Team,
  away: Team,
  homeScore: number | null,
  awayScore: number | null,
  status: MatchStatus = 'FINISHED',
  compId: string = COMP_ID,
  season: string = SEASON_ID
): Match {
  return {
    id,
    competitionId: compId,
    seasonId: season,
    matchday: 1,
    utcDate: new Date(dateStr),
    status,
    homeTeam: home,
    awayTeam: away,
    score: {
      halfTime: { home: null, away: null },
      fullTime: { home: homeScore, away: awayScore },
    },
    providerMetadata: { providerName: 'test', externalId: id, lastUpdated: new Date() },
  };
}

describe('FormCalculator', () => {
  const calc = new FormCalculator();

  it('returns AVAILABLE with max 5 results sorted utcDate DESC', () => {
    const history: Match[] = [
      createMatch('m1', '2026-08-01T18:00:00Z', TEAM_A, TEAM_B, 2, 0), // WIN
      createMatch('m2', '2026-08-03T18:00:00Z', TEAM_C, TEAM_A, 1, 3), // WIN
      createMatch('m3', '2026-08-05T18:00:00Z', TEAM_A, TEAM_B, 1, 1), // DRAW
      createMatch('m4', '2026-08-08T18:00:00Z', TEAM_A, TEAM_C, 0, 2), // LOSS
      createMatch('m5', '2026-08-10T18:00:00Z', TEAM_B, TEAM_A, 2, 1), // LOSS
      createMatch('m6', '2026-07-20T18:00:00Z', TEAM_A, TEAM_B, 3, 0), // 6th, oldest (should be cut)
    ];

    const res = calc.calculate('team-a', TARGET_DATE, COMP_ID, SEASON_ID, history);

    expect(res.availability).toBe('AVAILABLE');
    expect(res.results).toHaveLength(5);
    // Ordered DESC (most recent first): m5 (08-10 LOSS), m4 (08-08 LOSS), m3 (08-05 DRAW), m2 (08-03 WIN), m1 (08-01 WIN)
    expect(res.results).toEqual(['LOSS', 'LOSS', 'DRAW', 'WIN', 'WIN']);
  });

  it('handles exactly 4 matches (1-4 case)', () => {
    const history: Match[] = [
      createMatch('m1', '2026-08-01T18:00:00Z', TEAM_A, TEAM_B, 1, 0),
      createMatch('m2', '2026-08-03T18:00:00Z', TEAM_A, TEAM_C, 0, 0),
      createMatch('m3', '2026-08-05T18:00:00Z', TEAM_B, TEAM_A, 2, 1),
      createMatch('m4', '2026-08-08T18:00:00Z', TEAM_A, TEAM_B, 3, 1),
    ];

    const res = calc.calculate('team-a', TARGET_DATE, COMP_ID, SEASON_ID, history);

    expect(res.availability).toBe('AVAILABLE');
    expect(res.results).toHaveLength(4);
    expect(res.results).toEqual(['WIN', 'LOSS', 'DRAW', 'WIN']);
  });

  it('handles 1 match case', () => {
    const history: Match[] = [
      createMatch('m1', '2026-08-01T18:00:00Z', TEAM_A, TEAM_B, 2, 1),
    ];

    const res = calc.calculate('team-a', TARGET_DATE, COMP_ID, SEASON_ID, history);

    expect(res.availability).toBe('AVAILABLE');
    expect(res.results).toEqual(['WIN']);
  });

  it('returns INSUFFICIENT_DATA when 0 matches available', () => {
    const res = calc.calculate('team-a', TARGET_DATE, COMP_ID, SEASON_ID, []);

    expect(res.availability).toBe('INSUFFICIENT_DATA');
    expect(res.results).toEqual([]);
  });

  it('ignores matches with utcDate >= targetDate (anti look-ahead rule)', () => {
    const history: Match[] = [
      createMatch('past', '2026-08-14T23:59:59Z', TEAM_A, TEAM_B, 1, 0),
      createMatch('same', '2026-08-15T20:00:00Z', TEAM_A, TEAM_B, 2, 0),
      createMatch('future', '2026-08-16T18:00:00Z', TEAM_A, TEAM_B, 3, 0),
    ];

    const res = calc.calculate('team-a', TARGET_DATE, COMP_ID, SEASON_ID, history);

    expect(res.results).toHaveLength(1);
    expect(res.results).toEqual(['WIN']);
  });

  it('ignores matches from a different seasonId (no inter-season rule)', () => {
    const history: Match[] = [
      createMatch('m1', '2026-08-01T18:00:00Z', TEAM_A, TEAM_B, 1, 0, 'FINISHED', COMP_ID, 'season-2025'),
      createMatch('m2', '2026-08-05T18:00:00Z', TEAM_A, TEAM_B, 2, 0, 'FINISHED', COMP_ID, 'season-2026'),
    ];

    const res = calc.calculate('team-a', TARGET_DATE, COMP_ID, SEASON_ID, history);

    expect(res.results).toHaveLength(1);
    expect(res.results).toEqual(['WIN']);
  });

  it('ignores matches from a different competitionId', () => {
    const history: Match[] = [
      createMatch('m1', '2026-08-01T18:00:00Z', TEAM_A, TEAM_B, 1, 0, 'FINISHED', 'CL', SEASON_ID),
    ];

    const res = calc.calculate('team-a', TARGET_DATE, COMP_ID, SEASON_ID, history);

    expect(res.availability).toBe('INSUFFICIENT_DATA');
  });

  it('ignores non-FINISHED matches (SCHEDULED, LIVE, CANCELLED)', () => {
    const history: Match[] = [
      createMatch('m1', '2026-08-01T18:00:00Z', TEAM_A, TEAM_B, null, null, 'SCHEDULED'),
      createMatch('m2', '2026-08-02T18:00:00Z', TEAM_A, TEAM_B, 1, 0, 'LIVE'),
      createMatch('m3', '2026-08-03T18:00:00Z', TEAM_A, TEAM_B, null, null, 'CANCELLED'),
    ];

    const res = calc.calculate('team-a', TARGET_DATE, COMP_ID, SEASON_ID, history);

    expect(res.availability).toBe('INSUFFICIENT_DATA');
  });

  it('ignores matches with incomplete score (null home or away fullTime score)', () => {
    const history: Match[] = [
      createMatch('m1', '2026-08-01T18:00:00Z', TEAM_A, TEAM_B, null, 1, 'FINISHED'),
      createMatch('m2', '2026-08-02T18:00:00Z', TEAM_A, TEAM_B, 1, null, 'FINISHED'),
    ];

    const res = calc.calculate('team-a', TARGET_DATE, COMP_ID, SEASON_ID, history);

    expect(res.availability).toBe('INSUFFICIENT_DATA');
  });

  it('uses deterministic tie-break (id DESC) when utcDate is identical', () => {
    const history: Match[] = [
      createMatch('m10', '2026-08-01T18:00:00Z', TEAM_A, TEAM_B, 1, 0), // WIN
      createMatch('m20', '2026-08-01T18:00:00Z', TEAM_A, TEAM_C, 0, 2), // LOSS
    ];

    const res = calc.calculate('team-a', TARGET_DATE, COMP_ID, SEASON_ID, history);

    expect(res.results).toHaveLength(2);
    // m20 (LOSS) > m10 (WIN) in id DESC
    expect(res.results).toEqual(['LOSS', 'WIN']);
  });
});
