/**
 * Tests unitaires — SeasonStrengthCalculator (DEC-024).
 * Couche Domain — tests purs sans réseau, sans mock complexe.
 */

import { describe, it, expect } from 'vitest';
import { SeasonStrengthCalculator } from '../../src/domain/services/season-strength-calculator.js';
import { Match } from '../../src/domain/entities/match.js';
import { ProviderMetadata } from '../../src/domain/value-objects/provider-metadata.js';

describe('SeasonStrengthCalculator (DEC-024)', () => {
  const calculator = new SeasonStrengthCalculator();
  const targetDate = new Date('2026-08-25T19:00:00.000Z');
  const competitionId = 'FL1';
  const seasonId = 'season-2026-2027';

  const defaultMeta: ProviderMetadata = {
    providerName: 'test',
    externalId: 'ext-1',
    lastUpdated: new Date('2026-08-20T00:00:00.000Z'),
  };

  const createMatch = (
    id: string,
    homeId: string,
    awayId: string,
    utcDateStr: string,
    homeScore: number | null,
    awayScore: number | null,
    status: 'FINISHED' | 'SCHEDULED' | 'TIMED' = 'FINISHED',
    compId: string = competitionId,
    sId: string = seasonId
  ): Match => {
    return {
      id,
      competitionId: compId,
      seasonId: sId,
      matchday: 1,
      utcDate: new Date(utcDateStr),
      status,
      homeTeam: {
        id: homeId,
        name: `Team ${homeId}`,
        shortName: homeId,
        tla: homeId.slice(0, 3).toUpperCase(),
        crestUrl: null,
        providerMetadata: defaultMeta,
      },
      awayTeam: {
        id: awayId,
        name: `Team ${awayId}`,
        shortName: awayId,
        tla: awayId.slice(0, 3).toUpperCase(),
        crestUrl: null,
        providerMetadata: defaultMeta,
      },
      score: {
        halfTime: { home: null, away: null },
        fullTime: { home: homeScore, away: awayScore },
      },
      providerMetadata: defaultMeta,
    };
  };

  it('1. returns INSUFFICIENT_DATA when history is empty', () => {
    const profile = calculator.calculate(
      'team-A',
      targetDate,
      'HOME',
      competitionId,
      seasonId,
      []
    );

    expect(profile.teamId).toBe('team-A');
    expect(profile.overall.availability).toBe('INSUFFICIENT_DATA');
    expect(profile.overall.sampleSize).toBe(0);
    expect(profile.overall.metrics).toBeNull();
    expect(profile.contextual.venue).toBe('HOME');
    expect(profile.contextual.segment.availability).toBe('INSUFFICIENT_DATA');
    expect(profile.contextual.segment.sampleSize).toBe(0);
    expect(profile.contextual.segment.metrics).toBeNull();
  });

  it('2. returns AVAILABLE when at least 1 FINISHED match is eligible', () => {
    const history = [
      createMatch('m1', 'team-A', 'team-B', '2026-08-10T19:00:00.000Z', 2, 1),
    ];

    const profile = calculator.calculate(
      'team-A',
      targetDate,
      'HOME',
      competitionId,
      seasonId,
      history
    );

    expect(profile.overall.availability).toBe('AVAILABLE');
    expect(profile.overall.sampleSize).toBe(1);
    expect(profile.overall.metrics).not.toBeNull();
    expect(profile.contextual.segment.availability).toBe('AVAILABLE');
    expect(profile.contextual.segment.sampleSize).toBe(1);
  });

  it('3, 4, 5. correctly scores WIN (3 pts), DRAW (1 pt), LOSS (0 pt) and calculates played', () => {
    const history = [
      createMatch('m1', 'team-A', 'team-B', '2026-08-10T19:00:00.000Z', 2, 1), // WIN
      createMatch('m2', 'team-A', 'team-C', '2026-08-15T19:00:00.000Z', 1, 1), // DRAW
      createMatch('m3', 'team-A', 'team-D', '2026-08-20T19:00:00.000Z', 0, 3), // LOSS
    ];

    const profile = calculator.calculate(
      'team-A',
      targetDate,
      'HOME',
      competitionId,
      seasonId,
      history
    );

    expect(profile.overall.availability).toBe('AVAILABLE');
    if (profile.overall.availability === 'AVAILABLE') {
      const m = profile.overall.metrics;
      expect(m.played).toBe(3);
      expect(m.wins).toBe(1);
      expect(m.draws).toBe(1);
      expect(m.losses).toBe(1);
      expect(m.points).toBe(4); // 3 + 1 + 0
      expect(m.pointsPerMatch).toBeCloseTo(4 / 3, 6);
    }
  });

  it('6 & 7. correctly evaluates perspective when team is HOME vs AWAY', () => {
    const history = [
      createMatch('m1', 'team-A', 'team-B', '2026-08-10T19:00:00.000Z', 3, 1), // A is home, goalsFor 3, goalsAgainst 1 (WIN)
      createMatch('m2', 'team-C', 'team-A', '2026-08-15T19:00:00.000Z', 0, 2), // A is away, goalsFor 2, goalsAgainst 0 (WIN)
      createMatch('m3', 'team-D', 'team-A', '2026-08-20T19:00:00.000Z', 2, 1), // A is away, goalsFor 1, goalsAgainst 2 (LOSS)
    ];

    const profile = calculator.calculate(
      'team-A',
      targetDate,
      'AWAY',
      competitionId,
      seasonId,
      history
    );

    expect(profile.overall.availability).toBe('AVAILABLE');
    if (profile.overall.availability === 'AVAILABLE') {
      const m = profile.overall.metrics;
      expect(m.played).toBe(3);
      expect(m.wins).toBe(2);
      expect(m.draws).toBe(0);
      expect(m.losses).toBe(1);
      expect(m.goalsFor).toBe(6); // 3 + 2 + 1
      expect(m.goalsAgainst).toBe(3); // 1 + 0 + 2
      expect(m.goalDifference).toBe(3); // 6 - 3
      expect(m.goalsForPerMatch).toBe(2); // 6 / 3
      expect(m.goalsAgainstPerMatch).toBe(1); // 3 / 3
    }
  });

  it('8, 9, 10, 11, 12, 13. verifies all 11 exact unrounded metrics on overall segment', () => {
    const history = [
      createMatch('m1', 'team-A', 'team-B', '2026-08-01T19:00:00.000Z', 4, 1), // W (+3 pt, GF 4, GA 1)
      createMatch('m2', 'team-C', 'team-A', '2026-08-05T19:00:00.000Z', 2, 2), // D (+1 pt, GF 2, GA 2)
      createMatch('m3', 'team-A', 'team-D', '2026-08-10T19:00:00.000Z', 1, 0), // W (+3 pt, GF 1, GA 0)
      createMatch('m4', 'team-E', 'team-A', '2026-08-15T19:00:00.000Z', 3, 0), // L (+0 pt, GF 0, GA 3)
    ];

    const profile = calculator.calculate(
      'team-A',
      targetDate,
      'HOME',
      competitionId,
      seasonId,
      history
    );

    expect(profile.overall.availability).toBe('AVAILABLE');
    if (profile.overall.availability === 'AVAILABLE') {
      const m = profile.overall.metrics;
      expect(m.played).toBe(4);
      expect(m.wins).toBe(2);
      expect(m.draws).toBe(1);
      expect(m.losses).toBe(1);
      expect(m.points).toBe(7);
      expect(m.pointsPerMatch).toBe(1.75); // 7 / 4
      expect(m.goalsFor).toBe(7); // 4 + 2 + 1 + 0
      expect(m.goalsAgainst).toBe(6); // 1 + 2 + 0 + 3
      expect(m.goalDifference).toBe(1); // 7 - 6
      expect(m.goalsForPerMatch).toBe(1.75); // 7 / 4
      expect(m.goalsAgainstPerMatch).toBe(1.5); // 6 / 4
      expect(profile.overall.sampleSize).toBe(4);
    }
  });

  it('14. filters out matches from other seasons', () => {
    const history = [
      createMatch('m1', 'team-A', 'team-B', '2026-08-10T19:00:00.000Z', 2, 0, 'FINISHED', competitionId, 'other-season'),
    ];

    const profile = calculator.calculate('team-A', targetDate, 'HOME', competitionId, seasonId, history);
    expect(profile.overall.availability).toBe('INSUFFICIENT_DATA');
  });

  it('15. filters out non-FINISHED matches (SCHEDULED, TIMED)', () => {
    const history = [
      createMatch('m1', 'team-A', 'team-B', '2026-08-10T19:00:00.000Z', null, null, 'SCHEDULED'),
      createMatch('m2', 'team-A', 'team-C', '2026-08-12T19:00:00.000Z', null, null, 'TIMED'),
    ];

    const profile = calculator.calculate('team-A', targetDate, 'HOME', competitionId, seasonId, history);
    expect(profile.overall.availability).toBe('INSUFFICIENT_DATA');
  });

  it('16. filters out matches with incomplete fullTime score', () => {
    const history = [
      createMatch('m1', 'team-A', 'team-B', '2026-08-10T19:00:00.000Z', 1, null, 'FINISHED'),
      createMatch('m2', 'team-A', 'team-C', '2026-08-12T19:00:00.000Z', null, 0, 'FINISHED'),
    ];

    const profile = calculator.calculate('team-A', targetDate, 'HOME', competitionId, seasonId, history);
    expect(profile.overall.availability).toBe('INSUFFICIENT_DATA');
  });

  it('17, 18, 19. strict cutoff: targetDate excluded (< not <=) and future matches excluded', () => {
    const history = [
      createMatch('m1', 'team-A', 'team-B', '2026-08-20T19:00:00.000Z', 2, 0), // strictly before targetDate (valid)
      createMatch('m2', 'team-A', 'team-C', '2026-08-25T19:00:00.000Z', 1, 0), // exact targetDate (MUST BE EXCLUDED)
      createMatch('m3', 'team-A', 'team-D', '2026-08-30T19:00:00.000Z', 3, 0), // after targetDate (MUST BE EXCLUDED)
    ];

    const profile = calculator.calculate('team-A', targetDate, 'HOME', competitionId, seasonId, history);
    expect(profile.overall.availability).toBe('AVAILABLE');
    if (profile.overall.availability === 'AVAILABLE') {
      expect(profile.overall.metrics.played).toBe(1);
      expect(profile.overall.sampleSize).toBe(1);
      expect(profile.overall.metrics.goalsFor).toBe(2);
    }
  });

  it('20. ignores matches where team is not involved', () => {
    const history = [
      createMatch('m1', 'team-B', 'team-C', '2026-08-10T19:00:00.000Z', 5, 2),
    ];

    const profile = calculator.calculate('team-A', targetDate, 'HOME', competitionId, seasonId, history);
    expect(profile.overall.availability).toBe('INSUFFICIENT_DATA');
  });

  it('21, 22, 23, 24. contextual segment filters correctly and operates independently from overall', () => {
    const history = [
      createMatch('m1', 'team-B', 'team-A', '2026-08-10T19:00:00.000Z', 0, 1), // team-A played AWAY (Win 1-0)
      createMatch('m2', 'team-C', 'team-A', '2026-08-15T19:00:00.000Z', 1, 1), // team-A played AWAY (Draw 1-1)
    ];

    // Case A: Target match is HOME for team-A
    const profileHome = calculator.calculate('team-A', targetDate, 'HOME', competitionId, seasonId, history);
    expect(profileHome.overall.availability).toBe('AVAILABLE');
    expect(profileHome.overall.sampleSize).toBe(2);
    // Contextual is HOME, but team-A only played AWAY matches so far
    expect(profileHome.contextual.venue).toBe('HOME');
    expect(profileHome.contextual.segment.availability).toBe('INSUFFICIENT_DATA');
    expect(profileHome.contextual.segment.sampleSize).toBe(0);
    expect(profileHome.contextual.segment.metrics).toBeNull();

    // Case B: Target match is AWAY for team-A
    const profileAway = calculator.calculate('team-A', targetDate, 'AWAY', competitionId, seasonId, history);
    expect(profileAway.overall.availability).toBe('AVAILABLE');
    expect(profileAway.overall.sampleSize).toBe(2);
    expect(profileAway.contextual.venue).toBe('AWAY');
    expect(profileAway.contextual.segment.availability).toBe('AVAILABLE');
    expect(profileAway.contextual.segment.sampleSize).toBe(2);
    if (profileAway.contextual.segment.availability === 'AVAILABLE') {
      expect(profileAway.contextual.segment.metrics.played).toBe(2);
      expect(profileAway.contextual.segment.metrics.wins).toBe(1);
      expect(profileAway.contextual.segment.metrics.draws).toBe(1);
      expect(profileAway.contextual.segment.metrics.points).toBe(4);
    }
  });

  it('25. input array ordering does not affect calculation result (deterministic)', () => {
    const m1 = createMatch('m1', 'team-A', 'team-B', '2026-08-01T19:00:00.000Z', 3, 0);
    const m2 = createMatch('m2', 'team-A', 'team-C', '2026-08-08T19:00:00.000Z', 1, 1);
    const m3 = createMatch('m3', 'team-D', 'team-A', '2026-08-15T19:00:00.000Z', 2, 0);

    const order1 = [m1, m2, m3];
    const order2 = [m3, m1, m2];
    const order3 = [m2, m3, m1];

    const p1 = calculator.calculate('team-A', targetDate, 'HOME', competitionId, seasonId, order1);
    const p2 = calculator.calculate('team-A', targetDate, 'HOME', competitionId, seasonId, order2);
    const p3 = calculator.calculate('team-A', targetDate, 'HOME', competitionId, seasonId, order3);

    expect(p1).toEqual(p2);
    expect(p2).toEqual(p3);
  });
});
