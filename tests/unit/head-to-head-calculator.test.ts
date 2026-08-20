import { describe, it, expect } from 'vitest';
import { HeadToHeadCalculator } from '../../src/domain/services/head-to-head-calculator.js';
import { Match } from '../../src/domain/entities/match.js';
import { MatchStatus } from '../../src/domain/value-objects/match-status.js';

function createDummyMatch(params: {
  id: string;
  competitionId?: string;
  seasonId?: string;
  matchday?: number;
  utcDate: string;
  status?: MatchStatus;
  homeTeamId: string;
  homeTeamName?: string;
  awayTeamId: string;
  awayTeamName?: string;
  fullTimeHome?: number | null;
  fullTimeAway?: number | null;
}): Match {
  return {
    id: params.id,
    competitionId: params.competitionId ?? 'FL1',
    seasonId: params.seasonId ?? 'season-2026',
    matchday: params.matchday ?? 1,
    utcDate: new Date(params.utcDate),
    status: params.status ?? 'FINISHED',
    homeTeam: {
      id: params.homeTeamId,
      name: params.homeTeamName ?? 'Home Team',
      shortName: 'Home',
      tla: 'HOM',
      crestUrl: null,
      providerMetadata: {
        providerName: 'in-memory',
        externalId: params.homeTeamId,
        lastUpdated: new Date('2026-01-01T00:00:00.000Z'),
      },
    },
    awayTeam: {
      id: params.awayTeamId,
      name: params.awayTeamName ?? 'Away Team',
      shortName: 'Away',
      tla: 'AWY',
      crestUrl: null,
      providerMetadata: {
        providerName: 'in-memory',
        externalId: params.awayTeamId,
        lastUpdated: new Date('2026-01-01T00:00:00.000Z'),
      },
    },
    score: {
      halfTime: { home: null, away: null },
      fullTime: {
        home: params.fullTimeHome !== undefined ? params.fullTimeHome : 1,
        away: params.fullTimeAway !== undefined ? params.fullTimeAway : 0,
      },
    },
    providerMetadata: {
      providerName: 'in-memory',
      externalId: params.id,
      lastUpdated: new Date('2026-01-01T00:00:00.000Z'),
    },
  };
}

describe('HeadToHeadCalculator (Service Domaine Pur)', () => {
  const calculator = new HeadToHeadCalculator();

  const targetMatch = createDummyMatch({
    id: 'target-match-001',
    competitionId: 'FL1',
    seasonId: 'season-2026',
    utcDate: '2026-08-20T20:00:00.000Z',
    status: 'SCHEDULED',
    homeTeamId: 'team-alpha',
    awayTeamId: 'team-beta',
    fullTimeHome: null,
    fullTimeAway: null,
  });

  it('1. Retourne INSUFFICIENT_DATA lorsque le corpus ne contient aucune confrontation', () => {
    const profile = calculator.calculate(targetMatch, []);

    expect(profile.overall.availability).toBe('INSUFFICIENT_DATA');
    expect(profile.overall.sampleSize).toBe(0);
    expect(profile.overall.homeTeam).toBeNull();
    expect(profile.overall.awayTeam).toBeNull();
    expect(profile.overall.latestMeetingDate).toBeNull();
    expect(profile.overall.oldestMeetingDate).toBeNull();
    expect(profile.overall.seasonsCovered).toBe(0);

    expect(profile.contextual.venue).toBe('SAME_VENUE');
    expect(profile.contextual.segment.availability).toBe('INSUFFICIENT_DATA');
    expect(profile.contextual.segment.sampleSize).toBe(0);
  });

  it('2. Calcule correctement une seule confrontation (AVAILABLE, dates identiques, seasonsCovered = 1)', () => {
    const history = [
      createDummyMatch({
        id: 'h2h-001',
        competitionId: 'FL1',
        seasonId: 'season-2026',
        utcDate: '2026-02-15T20:00:00.000Z',
        homeTeamId: 'team-beta',
        awayTeamId: 'team-alpha',
        fullTimeHome: 1,
        fullTimeAway: 2, // Alpha gagne 2-1 à l'extérieur
      }),
    ];

    const profile = calculator.calculate(targetMatch, history);

    expect(profile.overall.availability).toBe('AVAILABLE');
    expect(profile.overall.sampleSize).toBe(1);
    expect(profile.overall.seasonsCovered).toBe(1);
    expect(profile.overall.latestMeetingDate).toEqual(new Date('2026-02-15T20:00:00.000Z'));
    expect(profile.overall.oldestMeetingDate).toEqual(new Date('2026-02-15T20:00:00.000Z'));

    // Alpha perspective (target home team)
    expect(profile.overall.homeTeam).toEqual({
      teamId: 'team-alpha',
      wins: 1,
      draws: 0,
      losses: 0,
      goalsFor: 2,
      goalsAgainst: 1,
      goalDifference: 1,
    });

    // Beta perspective (target away team)
    expect(profile.overall.awayTeam).toEqual({
      teamId: 'team-beta',
      wins: 0,
      draws: 0,
      losses: 1,
      goalsFor: 1,
      goalsAgainst: 2,
      goalDifference: -1,
    });

    // SAME_VENUE doit être INSUFFICIENT_DATA car le match s'est joué chez Beta
    expect(profile.contextual.segment.availability).toBe('INSUFFICIENT_DATA');
    expect(profile.contextual.segment.sampleSize).toBe(0);
  });

  it('3. Calcule correctement 2 confrontations avec segment SAME_VENUE indépendant', () => {
    const history = [
      // Match 1 : Alpha à domicile vs Beta (2-0)
      createDummyMatch({
        id: 'h2h-001',
        competitionId: 'FL1',
        seasonId: 'season-2026',
        utcDate: '2026-01-10T20:00:00.000Z',
        homeTeamId: 'team-alpha',
        awayTeamId: 'team-beta',
        fullTimeHome: 2,
        fullTimeAway: 0,
      }),
      // Match 2 : Beta à domicile vs Alpha (1-1)
      createDummyMatch({
        id: 'h2h-002',
        competitionId: 'FL1',
        seasonId: 'season-2025',
        utcDate: '2025-10-15T20:00:00.000Z',
        homeTeamId: 'team-beta',
        awayTeamId: 'team-alpha',
        fullTimeHome: 1,
        fullTimeAway: 1,
      }),
    ];

    const profile = calculator.calculate(targetMatch, history);

    expect(profile.overall.availability).toBe('AVAILABLE');
    expect(profile.overall.sampleSize).toBe(2);
    expect(profile.overall.seasonsCovered).toBe(2);
    expect(profile.overall.latestMeetingDate).toEqual(new Date('2026-01-10T20:00:00.000Z'));
    expect(profile.overall.oldestMeetingDate).toEqual(new Date('2025-10-15T20:00:00.000Z'));

    // Alpha : 1 win, 1 draw, 0 loss, GF=3, GA=1, GD=2
    expect(profile.overall.homeTeam).toEqual({
      teamId: 'team-alpha',
      wins: 1,
      draws: 1,
      losses: 0,
      goalsFor: 3,
      goalsAgainst: 1,
      goalDifference: 2,
    });

    // SAME_VENUE : seul le match 1 correspond (Alpha domicile vs Beta extérieur)
    expect(profile.contextual.segment.availability).toBe('AVAILABLE');
    expect(profile.contextual.segment.sampleSize).toBe(1);
    expect(profile.contextual.segment.seasonsCovered).toBe(1);
    expect(profile.contextual.segment.homeTeam).toEqual({
      teamId: 'team-alpha',
      wins: 1,
      draws: 0,
      losses: 0,
      goalsFor: 2,
      goalsAgainst: 0,
      goalDifference: 2,
    });
  });

  it('4. Retient au maximum 5 confrontations et les trie par utcDate DESC puis id DESC', () => {
    const history = [
      createDummyMatch({ id: 'm1', utcDate: '2024-01-01T00:00:00.000Z', homeTeamId: 'team-alpha', awayTeamId: 'team-beta', seasonId: 's-1' }),
      createDummyMatch({ id: 'm2', utcDate: '2024-06-01T00:00:00.000Z', homeTeamId: 'team-alpha', awayTeamId: 'team-beta', seasonId: 's-1' }),
      createDummyMatch({ id: 'm3', utcDate: '2025-01-01T00:00:00.000Z', homeTeamId: 'team-alpha', awayTeamId: 'team-beta', seasonId: 's-2' }),
      createDummyMatch({ id: 'm4', utcDate: '2025-06-01T00:00:00.000Z', homeTeamId: 'team-alpha', awayTeamId: 'team-beta', seasonId: 's-2' }),
      createDummyMatch({ id: 'm5', utcDate: '2026-01-01T00:00:00.000Z', homeTeamId: 'team-alpha', awayTeamId: 'team-beta', seasonId: 's-3' }),
      createDummyMatch({ id: 'm6', utcDate: '2026-02-01T00:00:00.000Z', homeTeamId: 'team-alpha', awayTeamId: 'team-beta', seasonId: 's-3' }),
      createDummyMatch({ id: 'm7', utcDate: '2026-03-01T00:00:00.000Z', homeTeamId: 'team-alpha', awayTeamId: 'team-beta', seasonId: 's-3' }),
    ];

    const profile = calculator.calculate(targetMatch, history);

    expect(profile.overall.sampleSize).toBe(5);
    // Les 5 plus récents sont m7 (2026-03), m6 (2026-02), m5 (2026-01), m4 (2025-06), m3 (2025-01)
    expect(profile.overall.latestMeetingDate).toEqual(new Date('2026-03-01T00:00:00.000Z'));
    expect(profile.overall.oldestMeetingDate).toEqual(new Date('2025-01-01T00:00:00.000Z'));
    expect(profile.overall.seasonsCovered).toBe(2); // s-3 et s-2 sont couverts par les 5 retenus
  });

  it('5. Exclut strictement les matchs au-delà de 3 saisons', () => {
    const history = [
      createDummyMatch({ id: 'm-s1', utcDate: '2026-01-01T00:00:00.000Z', homeTeamId: 'team-alpha', awayTeamId: 'team-beta', seasonId: 'season-2026' }),
      createDummyMatch({ id: 'm-s2', utcDate: '2025-01-01T00:00:00.000Z', homeTeamId: 'team-alpha', awayTeamId: 'team-beta', seasonId: 'season-2025' }),
      createDummyMatch({ id: 'm-s3', utcDate: '2024-01-01T00:00:00.000Z', homeTeamId: 'team-alpha', awayTeamId: 'team-beta', seasonId: 'season-2024' }),
      createDummyMatch({ id: 'm-s4', utcDate: '2023-01-01T00:00:00.000Z', homeTeamId: 'team-alpha', awayTeamId: 'team-beta', seasonId: 'season-2023' }), // 4e saison
    ];

    const profile = calculator.calculate(targetMatch, history);

    expect(profile.overall.sampleSize).toBe(3);
    expect(profile.overall.seasonsCovered).toBe(3);
    expect(profile.overall.oldestMeetingDate).toEqual(new Date('2024-01-01T00:00:00.000Z'));
  });

  it('6. Filtres stricts : exclut les matchs futurs, targetDate exacte, non-FINISHED, fullTime incomplet, autre compétition et autres équipes', () => {
    const history = [
      // Futur
      createDummyMatch({ id: 'f1', utcDate: '2026-08-25T00:00:00.000Z', homeTeamId: 'team-alpha', awayTeamId: 'team-beta' }),
      // Égalité targetDate exacte
      createDummyMatch({ id: 'f2', utcDate: '2026-08-20T20:00:00.000Z', homeTeamId: 'team-alpha', awayTeamId: 'team-beta' }),
      // Non FINISHED (SCHEDULED)
      createDummyMatch({ id: 'f3', utcDate: '2026-01-01T00:00:00.000Z', status: 'SCHEDULED', homeTeamId: 'team-alpha', awayTeamId: 'team-beta' }),
      // Score incomplet
      createDummyMatch({ id: 'f4', utcDate: '2026-01-02T00:00:00.000Z', homeTeamId: 'team-alpha', awayTeamId: 'team-beta', fullTimeHome: null }),
      // Autre compétition
      createDummyMatch({ id: 'f5', utcDate: '2026-01-03T00:00:00.000Z', competitionId: 'PL', homeTeamId: 'team-alpha', awayTeamId: 'team-beta' }),
      // Autre équipe
      createDummyMatch({ id: 'f6', utcDate: '2026-01-04T00:00:00.000Z', homeTeamId: 'team-alpha', awayTeamId: 'team-gamma' }),
    ];

    const profile = calculator.calculate(targetMatch, history);
    expect(profile.overall.availability).toBe('INSUFFICIENT_DATA');
    expect(profile.overall.sampleSize).toBe(0);
  });

  it('7. Invariants de symétrie mathématique pour tout segment AVAILABLE', () => {
    const history = [
      createDummyMatch({ id: 'm1', utcDate: '2026-01-01T00:00:00.000Z', homeTeamId: 'team-alpha', awayTeamId: 'team-beta', fullTimeHome: 3, fullTimeAway: 1 }),
      createDummyMatch({ id: 'm2', utcDate: '2026-02-01T00:00:00.000Z', homeTeamId: 'team-beta', awayTeamId: 'team-alpha', fullTimeHome: 2, fullTimeAway: 2 }),
      createDummyMatch({ id: 'm3', utcDate: '2026-03-01T00:00:00.000Z', homeTeamId: 'team-beta', awayTeamId: 'team-alpha', fullTimeHome: 1, fullTimeAway: 0 }),
    ];

    const profile = calculator.calculate(targetMatch, history);
    const home = profile.overall.homeTeam!;
    const away = profile.overall.awayTeam!;

    expect(home.wins).toBe(away.losses);
    expect(home.losses).toBe(away.wins);
    expect(home.draws).toBe(away.draws);
    expect(home.goalsFor).toBe(away.goalsAgainst);
    expect(home.goalsAgainst).toBe(away.goalsFor);
    expect(home.goalDifference).toBe(-away.goalDifference);
    expect(home.wins + home.draws + home.losses).toBe(profile.overall.sampleSize);
  });

  it('8. Déterminisme et non-mutation du tableau d\'entrée', () => {
    const history = [
      createDummyMatch({ id: 'm1', utcDate: '2026-01-01T00:00:00.000Z', homeTeamId: 'team-alpha', awayTeamId: 'team-beta', fullTimeHome: 1, fullTimeAway: 0 }),
      createDummyMatch({ id: 'm2', utcDate: '2026-02-01T00:00:00.000Z', homeTeamId: 'team-beta', awayTeamId: 'team-alpha', fullTimeHome: 0, fullTimeAway: 1 }),
    ];

    const cloneBefore = JSON.stringify(history);
    const res1 = calculator.calculate(targetMatch, history);
    const res2 = calculator.calculate(targetMatch, history);

    expect(JSON.stringify(history)).toBe(cloneBefore);
    expect(res1).toEqual(res2);
  });
});
