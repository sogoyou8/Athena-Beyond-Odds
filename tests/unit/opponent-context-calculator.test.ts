/**
 * Tests unitaires — OpponentContextCalculator (DEC-035 / DEC-036 Phase 3.7).
 * Couche Domain — pure, synchrone, déterministe, 0 I/O.
 */

import { describe, it, expect } from 'vitest';
import { OpponentContextCalculator } from '../../src/domain/services/opponent-context-calculator.js';
import { Match } from '../../src/domain/entities/match.js';
import { Team } from '../../src/domain/entities/team.js';
import { MatchStatus } from '../../src/domain/value-objects/match-status.js';

// ---------------------------------------------------------------------------
// Helpers pour créer des Match fixtures
// ---------------------------------------------------------------------------

function createTeam(id: string, name: string): Team {
  return {
    id,
    name,
    shortName: name,
    tla: name.slice(0, 3).toUpperCase(),
    crestUrl: null,
    providerMetadata: {
      providerName: 'test',
      externalId: id,
      lastUpdated: new Date('2026-08-21T00:00:00.000Z'),
    },
  };
}

const TEAM_TARGET = createTeam('team-target', 'Target FC');
const TEAM_A = createTeam('team-a', 'Team A');
const TEAM_B = createTeam('team-b', 'Team B');
const TEAM_C = createTeam('team-c', 'Team C');
const TEAM_D = createTeam('team-d', 'Team D');
const TEAM_E = createTeam('team-e', 'Team E');

function createMatch(options: {
  id: string;
  competitionId?: string;
  seasonId?: string;
  utcDate: string;
  status?: MatchStatus;
  homeTeam: Team;
  awayTeam: Team;
  homeGoals?: number | null;
  awayGoals?: number | null;
}): Match {
  return {
    id: options.id,
    competitionId: options.competitionId ?? 'comp-fl1',
    seasonId: options.seasonId ?? 'season-2099',
    matchday: 1,
    utcDate: new Date(options.utcDate),
    status: options.status ?? 'FINISHED',
    homeTeam: options.homeTeam,
    awayTeam: options.awayTeam,
    score: {
      halfTime: { home: null, away: null },
      fullTime: {
        home: options.homeGoals !== undefined ? options.homeGoals : 1,
        away: options.awayGoals !== undefined ? options.awayGoals : 0,
      },
    },
    providerMetadata: {
      providerName: 'test',
      externalId: options.id,
      lastUpdated: new Date(options.utcDate),
    },
  };
}

function buildHistoryByTeam(matches: Match[]): Map<string, Match[]> {
  const map = new Map<string, Match[]>();
  for (const m of matches) {
    if (!map.has(m.homeTeam.id)) map.set(m.homeTeam.id, []);
    if (!map.has(m.awayTeam.id)) map.set(m.awayTeam.id, []);
    map.get(m.homeTeam.id)!.push(m);
    map.get(m.awayTeam.id)!.push(m);
  }
  return map;
}

describe('OpponentContextCalculator', () => {
  const calculator = new OpponentContextCalculator();
  const targetMatch = createMatch({
    id: 'target-match',
    utcDate: '2099-08-15T20:00:00.000Z',
    status: 'SCHEDULED',
    homeTeam: TEAM_TARGET,
    awayTeam: TEAM_A,
    homeGoals: null,
    awayGoals: null,
  });

  it('1. retient au maximum 5 matchs récents pour l\'équipe cible', () => {
    const recentMatches: Match[] = [
      createMatch({ id: 'm1', utcDate: '2099-08-10T18:00:00.000Z', homeTeam: TEAM_TARGET, awayTeam: TEAM_A }),
      createMatch({ id: 'm2', utcDate: '2099-08-08T18:00:00.000Z', homeTeam: TEAM_B, awayTeam: TEAM_TARGET }),
      createMatch({ id: 'm3', utcDate: '2099-08-05T18:00:00.000Z', homeTeam: TEAM_TARGET, awayTeam: TEAM_C }),
      createMatch({ id: 'm4', utcDate: '2099-08-02T18:00:00.000Z', homeTeam: TEAM_D, awayTeam: TEAM_TARGET }),
      createMatch({ id: 'm5', utcDate: '2099-07-28T18:00:00.000Z', homeTeam: TEAM_TARGET, awayTeam: TEAM_E }),
      createMatch({ id: 'm6', utcDate: '2099-07-20T18:00:00.000Z', homeTeam: TEAM_A, awayTeam: TEAM_TARGET }), // 6ème, exclu
    ];
    const historyByTeam = buildHistoryByTeam(recentMatches);

    const profile = calculator.calculate({
      targetMatch,
      targetTeamId: TEAM_TARGET.id,
      historyByTeam,
    });

    expect(profile.recentMatchSampleSize).toBe(5);
    expect(profile.opponents.length).toBe(5);
    expect(profile.opponents.map((o) => o.recentMatchId)).toEqual(['m1', 'm2', 'm3', 'm4', 'm5']);
  });

  it('2. gère moins de 5 matchs récents (ex: 3 matchs)', () => {
    const matches: Match[] = [
      createMatch({ id: 'm1', utcDate: '2099-08-10T18:00:00.000Z', homeTeam: TEAM_TARGET, awayTeam: TEAM_A }),
      createMatch({ id: 'm2', utcDate: '2099-08-08T18:00:00.000Z', homeTeam: TEAM_B, awayTeam: TEAM_TARGET }),
      createMatch({ id: 'm3', utcDate: '2099-08-05T18:00:00.000Z', homeTeam: TEAM_TARGET, awayTeam: TEAM_C }),
    ];
    const historyByTeam = buildHistoryByTeam(matches);

    const profile = calculator.calculate({
      targetMatch,
      targetTeamId: TEAM_TARGET.id,
      historyByTeam,
    });

    expect(profile.recentMatchSampleSize).toBe(3);
    expect(profile.evaluatedOpponentSampleSize).toBe(3);
    expect(profile.availability).toBe('AVAILABLE');
  });

  it('3 & 4. trie les matchs récents par utcDate DESC puis Match.id DESC', () => {
    const matches: Match[] = [
      createMatch({ id: 'm-alpha', utcDate: '2099-08-05T18:00:00.000Z', homeTeam: TEAM_TARGET, awayTeam: TEAM_A }),
      createMatch({ id: 'm-beta', utcDate: '2099-08-10T18:00:00.000Z', homeTeam: TEAM_B, awayTeam: TEAM_TARGET }),
      createMatch({ id: 'm-same-date-1', utcDate: '2099-08-08T18:00:00.000Z', homeTeam: TEAM_TARGET, awayTeam: TEAM_C }),
      createMatch({ id: 'm-same-date-2', utcDate: '2099-08-08T18:00:00.000Z', homeTeam: TEAM_D, awayTeam: TEAM_TARGET }),
    ];
    const historyByTeam = buildHistoryByTeam(matches);

    const profile = calculator.calculate({
      targetMatch,
      targetTeamId: TEAM_TARGET.id,
      historyByTeam,
    });

    expect(profile.opponents.map((o) => o.recentMatchId)).toEqual([
      'm-beta',
      'm-same-date-2', // 'm-same-date-2' > 'm-same-date-1'
      'm-same-date-1',
      'm-alpha',
    ]);
  });

  it('5. exclut les matchs d\'une autre compétition', () => {
    const matches: Match[] = [
      createMatch({ id: 'm1', utcDate: '2099-08-10T18:00:00.000Z', homeTeam: TEAM_TARGET, awayTeam: TEAM_A }),
      createMatch({ id: 'm2', competitionId: 'other-comp', utcDate: '2099-08-08T18:00:00.000Z', homeTeam: TEAM_B, awayTeam: TEAM_TARGET }),
    ];
    const historyByTeam = buildHistoryByTeam(matches);

    const profile = calculator.calculate({
      targetMatch,
      targetTeamId: TEAM_TARGET.id,
      historyByTeam,
    });

    expect(profile.recentMatchSampleSize).toBe(1);
    expect(profile.opponents[0]!.recentMatchId).toBe('m1');
  });

  it('6. exclut les matchs d\'une saison antérieure (TARGET_SEASON_ONLY)', () => {
    const matches: Match[] = [
      createMatch({ id: 'm1', utcDate: '2099-08-10T18:00:00.000Z', homeTeam: TEAM_TARGET, awayTeam: TEAM_A }),
      createMatch({ id: 'm-old-season', seasonId: 'season-2098', utcDate: '2099-08-08T18:00:00.000Z', homeTeam: TEAM_B, awayTeam: TEAM_TARGET }),
    ];
    const historyByTeam = buildHistoryByTeam(matches);

    const profile = calculator.calculate({
      targetMatch,
      targetTeamId: TEAM_TARGET.id,
      historyByTeam,
    });

    expect(profile.recentMatchSampleSize).toBe(1);
  });

  it('7 & 8. exclut strictement les matchs dont utcDate >= targetMatch.utcDate (anti-lookahead)', () => {
    const matches: Match[] = [
      createMatch({ id: 'm1', utcDate: '2099-08-10T18:00:00.000Z', homeTeam: TEAM_TARGET, awayTeam: TEAM_A }),
      createMatch({ id: 'm-same-time', utcDate: '2099-08-15T20:00:00.000Z', homeTeam: TEAM_B, awayTeam: TEAM_TARGET }),
      createMatch({ id: 'm-future', utcDate: '2099-08-20T18:00:00.000Z', homeTeam: TEAM_C, awayTeam: TEAM_TARGET }),
    ];
    const historyByTeam = buildHistoryByTeam(matches);

    const profile = calculator.calculate({
      targetMatch,
      targetTeamId: TEAM_TARGET.id,
      historyByTeam,
    });

    expect(profile.recentMatchSampleSize).toBe(1);
    expect(profile.opponents[0]!.recentMatchId).toBe('m1');
  });

  it('9 & 10. exclut les matchs non FINISHED ou avec score fullTime incomplet', () => {
    const matches: Match[] = [
      createMatch({ id: 'm1', utcDate: '2099-08-10T18:00:00.000Z', homeTeam: TEAM_TARGET, awayTeam: TEAM_A }),
      createMatch({ id: 'm-scheduled', status: 'SCHEDULED', utcDate: '2099-08-08T18:00:00.000Z', homeTeam: TEAM_B, awayTeam: TEAM_TARGET }),
      createMatch({ id: 'm-null-score', utcDate: '2099-08-05T18:00:00.000Z', homeTeam: TEAM_TARGET, awayTeam: TEAM_C, homeGoals: null, awayGoals: null }),
    ];
    const historyByTeam = buildHistoryByTeam(matches);

    const profile = calculator.calculate({
      targetMatch,
      targetTeamId: TEAM_TARGET.id,
      historyByTeam,
    });

    expect(profile.recentMatchSampleSize).toBe(1);
  });

  it('11, 12, 13, 14, 15. dérive correctement l\'adversaire et son venue (HOME/AWAY)', () => {
    const matches: Match[] = [
      // Target est HOME -> Opponent est awayTeam (TEAM_A), son venue dans ce match est AWAY
      createMatch({ id: 'm1', utcDate: '2099-08-10T18:00:00.000Z', homeTeam: TEAM_TARGET, awayTeam: TEAM_A }),
      // Target est AWAY -> Opponent est homeTeam (TEAM_B), son venue dans ce match est HOME
      createMatch({ id: 'm2', utcDate: '2099-08-08T18:00:00.000Z', homeTeam: TEAM_B, awayTeam: TEAM_TARGET }),
    ];
    const historyByTeam = buildHistoryByTeam(matches);

    const profile = calculator.calculate({
      targetMatch,
      targetTeamId: TEAM_TARGET.id,
      historyByTeam,
    });

    expect(profile.opponents[0]!.opponentTeamId).toBe('team-a');
    expect(profile.opponents[0]!.opponentTeamName).toBe('Team A');
    expect(profile.opponents[0]!.opponentVenue).toBe('AWAY');

    expect(profile.opponents[1]!.opponentTeamId).toBe('team-b');
    expect(profile.opponents[1]!.opponentTeamName).toBe('Team B');
    expect(profile.opponents[1]!.opponentVenue).toBe('HOME');
  });

  it('16, 17, 18, 19, 20, 21. calcule les profils overall et contextuel de l\'adversaire au cutoff en incluant la rencontre récente', () => {
    // Rencontre récente : Target vs Team A (2-1) le 2099-08-10 -> Team A était AWAY (défaite 1-2 pour A)
    const mRecent = createMatch({ id: 'm-recent', utcDate: '2099-08-10T18:00:00.000Z', homeTeam: TEAM_TARGET, awayTeam: TEAM_A, homeGoals: 2, awayGoals: 1 });
    // Autres matchs de Team A dans la saison avant cutoff:
    // A vs B (3-0) HOME de A -> Victoire (+3 pts, diff +3)
    const mA1 = createMatch({ id: 'mA1', utcDate: '2099-08-01T18:00:00.000Z', homeTeam: TEAM_A, awayTeam: TEAM_B, homeGoals: 3, awayGoals: 0 });
    // C vs A (1-1) AWAY de A -> Nul (+1 pt, diff 0)
    const mA2 = createMatch({ id: 'mA2', utcDate: '2099-07-25T18:00:00.000Z', homeTeam: TEAM_C, awayTeam: TEAM_A, homeGoals: 1, awayGoals: 1 });

    // Ajoutons d'autres matchs pour Target pour avoir 3 adversaires distincts
    const mRecent2 = createMatch({ id: 'm-recent2', utcDate: '2099-08-05T18:00:00.000Z', homeTeam: TEAM_TARGET, awayTeam: TEAM_B });
    const mRecent3 = createMatch({ id: 'm-recent3', utcDate: '2099-08-01T18:00:00.000Z', homeTeam: TEAM_TARGET, awayTeam: TEAM_C });

    const allMatches = [mRecent, mA1, mA2, mRecent2, mRecent3];
    const historyByTeam = buildHistoryByTeam(allMatches);

    const profile = calculator.calculate({
      targetMatch,
      targetTeamId: TEAM_TARGET.id,
      historyByTeam,
    });

    const entryA = profile.opponents.find((o) => o.opponentTeamId === 'team-a')!;
    expect(entryA).toBeDefined();

    // Overall de Team A : mA1 (W, 3pts, +3), mA2 (D, 1pt, 0), mRecent (L, 0pt, -1)
    // 3 matchs, total pts = 4, PPM = 4/3 ≈ 1.3333333333333333
    // total GF = 3+1+1 = 5, total GA = 0+1+2 = 3, GD = +2, GD/m = 2/3 ≈ 0.6666666666666666
    expect(entryA.overall.sampleSize).toBe(3);
    expect(entryA.overall.pointsPerMatch).toBeCloseTo(4 / 3, 10);
    expect(entryA.overall.goalDifferencePerMatch).toBeCloseTo(2 / 3, 10);

    // Contextuel de Team A (opponentVenue = AWAY dans mRecent) :
    // Matchs AWAY de Team A : mA2 (D 1-1, 1pt, diff 0) + mRecent (L 1-2, 0pt, diff -1)
    // 2 matchs, total pts = 1, PPM = 1/2 = 0.5
    // total GF = 1+1 = 2, total GA = 1+2 = 3, GD = -1, GD/m = -0.5
    expect(entryA.contextual.sampleSize).toBe(2);
    expect(entryA.contextual.pointsPerMatch).toBe(0.5);
    expect(entryA.contextual.goalDifferencePerMatch).toBe(-0.5);
  });

  it('22 & 23. conserve les doublons d\'adversaires en entries et applique MATCH_ENTRY_WEIGHTING aux agrégats', () => {
    // 3 matchs récents contre 3 équipes, mais Team A est affronté 2 fois :
    const m1 = createMatch({ id: 'm1', utcDate: '2099-08-10T18:00:00.000Z', homeTeam: TEAM_TARGET, awayTeam: TEAM_A, homeGoals: 1, awayGoals: 0 }); // Team A (AWAY)
    const m2 = createMatch({ id: 'm2', utcDate: '2099-08-08T18:00:00.000Z', homeTeam: TEAM_A, awayTeam: TEAM_TARGET, homeGoals: 2, awayGoals: 0 }); // Team A (HOME)
    const m3 = createMatch({ id: 'm3', utcDate: '2099-08-05T18:00:00.000Z', homeTeam: TEAM_TARGET, awayTeam: TEAM_B, homeGoals: 1, awayGoals: 1 }); // Team B (AWAY)
    const m4 = createMatch({ id: 'm4', utcDate: '2099-08-02T18:00:00.000Z', homeTeam: TEAM_TARGET, awayTeam: TEAM_C, homeGoals: 0, awayGoals: 1 }); // Team C (AWAY)

    const allMatches = [m1, m2, m3, m4];
    const historyByTeam = buildHistoryByTeam(allMatches);

    const profile = calculator.calculate({
      targetMatch,
      targetTeamId: TEAM_TARGET.id,
      historyByTeam,
    });

    expect(profile.opponents.length).toBe(4);
    expect(profile.recentMatchSampleSize).toBe(4);
    // Adversaires distincts : A, B, C => 3 distincts
    expect(profile.evaluatedOpponentSampleSize).toBe(3);
    expect(profile.availability).toBe('AVAILABLE');

    // Les 2 entries de Team A existent séparément :
    expect(profile.opponents[0]!.opponentTeamId).toBe('team-a');
    expect(profile.opponents[0]!.opponentVenue).toBe('AWAY');
    expect(profile.opponents[1]!.opponentTeamId).toBe('team-a');
    expect(profile.opponents[1]!.opponentVenue).toBe('HOME');

    // Vérification de la moyenne sur les 4 entries (MATCH_ENTRY_WEIGHTING)
    const expectedAvgPpm =
      (profile.opponents[0]!.overall.pointsPerMatch +
        profile.opponents[1]!.overall.pointsPerMatch +
        profile.opponents[2]!.overall.pointsPerMatch +
        profile.opponents[3]!.overall.pointsPerMatch) /
      4;

    expect(profile.averageOpponentPointsPerMatch).toBeCloseTo(expectedAvgPpm, 10);
  });

  it('24 & 26. passe en INSUFFICIENT_DATA si 5 rencontres mais seulement 2 adversaires distincts', () => {
    // 5 matchs récents mais uniquement contre Team A et Team B
    const matches: Match[] = [
      createMatch({ id: 'm1', utcDate: '2099-08-10T18:00:00.000Z', homeTeam: TEAM_TARGET, awayTeam: TEAM_A }),
      createMatch({ id: 'm2', utcDate: '2099-08-08T18:00:00.000Z', homeTeam: TEAM_B, awayTeam: TEAM_TARGET }),
      createMatch({ id: 'm3', utcDate: '2099-08-05T18:00:00.000Z', homeTeam: TEAM_TARGET, awayTeam: TEAM_A }),
      createMatch({ id: 'm4', utcDate: '2099-08-02T18:00:00.000Z', homeTeam: TEAM_B, awayTeam: TEAM_TARGET }),
      createMatch({ id: 'm5', utcDate: '2099-07-28T18:00:00.000Z', homeTeam: TEAM_TARGET, awayTeam: TEAM_A }),
    ];
    const historyByTeam = buildHistoryByTeam(matches);

    const profile = calculator.calculate({
      targetMatch,
      targetTeamId: TEAM_TARGET.id,
      historyByTeam,
    });

    expect(profile.recentMatchSampleSize).toBe(5);
    expect(profile.evaluatedOpponentSampleSize).toBe(2); // 2 distincts < 3
    expect(profile.availability).toBe('INSUFFICIENT_DATA');

    // Les sample sizes restent numériques :
    expect(profile.contextualSampleSize).toBe(5);

    // Les agrégats sont obligatoirement null (aucun faux zéro) :
    expect(profile.averageOpponentPointsPerMatch).toBeNull();
    expect(profile.averageOpponentGoalDifferencePerMatch).toBeNull();
    expect(profile.averageContextualOpponentPointsPerMatch).toBeNull();
    expect(profile.averageContextualOpponentGoalDifferencePerMatch).toBeNull();

    // Les entries individuelles sont conservées pour traçabilité :
    expect(profile.opponents.length).toBe(5);
  });

  it('27. passe en INSUFFICIENT_DATA si 0 match récent', () => {
    const historyByTeam = new Map<string, Match[]>();

    const profile = calculator.calculate({
      targetMatch,
      targetTeamId: TEAM_TARGET.id,
      historyByTeam,
    });

    expect(profile.availability).toBe('INSUFFICIENT_DATA');
    expect(profile.recentMatchSampleSize).toBe(0);
    expect(profile.evaluatedOpponentSampleSize).toBe(0);
    expect(profile.contextualSampleSize).toBe(0);
    expect(profile.averageOpponentPointsPerMatch).toBeNull();
    expect(profile.averageOpponentGoalDifferencePerMatch).toBeNull();
    expect(profile.opponents).toEqual([]);
  });

  it('28, 29, 30. préserve les vrais zéros (PPM = 0.00 et GD/m = 0.00) sans les convertir en null', () => {
    // Team A a 0 victoire, 0 nul -> 1 défaite (0 pt)
    const m1 = createMatch({ id: 'm1', utcDate: '2099-08-10T18:00:00.000Z', homeTeam: TEAM_TARGET, awayTeam: TEAM_A, homeGoals: 2, awayGoals: 0 });
    // Team B a 0 victoire, 0 nul -> 1 défaite (0 pt)
    const m2 = createMatch({ id: 'm2', utcDate: '2099-08-08T18:00:00.000Z', homeTeam: TEAM_TARGET, awayTeam: TEAM_B, homeGoals: 1, awayGoals: 0 });
    // Team C a 0 victoire, 0 nul -> 1 défaite (0 pt)
    const m3 = createMatch({ id: 'm3', utcDate: '2099-08-05T18:00:00.000Z', homeTeam: TEAM_TARGET, awayTeam: TEAM_C, homeGoals: 3, awayGoals: 0 });

    const allMatches = [m1, m2, m3];
    const historyByTeam = buildHistoryByTeam(allMatches);

    const profile = calculator.calculate({
      targetMatch,
      targetTeamId: TEAM_TARGET.id,
      historyByTeam,
    });

    expect(profile.availability).toBe('AVAILABLE');
    // Chaque adversaire a PPM = 0
    expect(profile.opponents[0]!.overall.pointsPerMatch).toBe(0);
    expect(profile.opponents[1]!.overall.pointsPerMatch).toBe(0);
    expect(profile.opponents[2]!.overall.pointsPerMatch).toBe(0);
    // Moyenne PPM = 0.0 (vrai zéro)
    expect(profile.averageOpponentPointsPerMatch).toBe(0);
  });

  it('31, 32, 33. ne mute pas les tableaux d\'entrée ni les structures Match', () => {
    const m1 = createMatch({ id: 'm1', utcDate: '2099-08-05T18:00:00.000Z', homeTeam: TEAM_TARGET, awayTeam: TEAM_A });
    const m2 = createMatch({ id: 'm2', utcDate: '2099-08-10T18:00:00.000Z', homeTeam: TEAM_TARGET, awayTeam: TEAM_B });
    const m3 = createMatch({ id: 'm3', utcDate: '2099-08-01T18:00:00.000Z', homeTeam: TEAM_TARGET, awayTeam: TEAM_C });

    const originalTargetHistory = [m1, m2, m3];
    const historyByTeam = new Map<string, Match[]>([
      [TEAM_TARGET.id, originalTargetHistory],
      [TEAM_A.id, [m1]],
      [TEAM_B.id, [m2]],
      [TEAM_C.id, [m3]],
    ]);

    // Snapshot avant calcul
    const historySnapshot = [...originalTargetHistory];

    calculator.calculate({
      targetMatch,
      targetTeamId: TEAM_TARGET.id,
      historyByTeam,
    });

    // Vérifier qu'aucun ordre ou tableau n'a été muté
    expect(originalTargetHistory).toEqual(historySnapshot);
  });

  it('34 & 35. n\'applique aucun arrondi dans le domaine et produit des nombres finis exacts', () => {
    // 3 adversaires avec des PPM non ronds (ex: 1/3, 2/3, 1/3)
    const m1 = createMatch({ id: 'm1', utcDate: '2099-08-10T18:00:00.000Z', homeTeam: TEAM_TARGET, awayTeam: TEAM_A, homeGoals: 0, awayGoals: 0 }); // Team A: 1 pt / 1 = 1
    const m2 = createMatch({ id: 'm2', utcDate: '2099-08-08T18:00:00.000Z', homeTeam: TEAM_TARGET, awayTeam: TEAM_B, homeGoals: 2, awayGoals: 0 }); // Team B: 0 pt / 1 = 0
    const m3 = createMatch({ id: 'm3', utcDate: '2099-08-05T18:00:00.000Z', homeTeam: TEAM_TARGET, awayTeam: TEAM_C, homeGoals: 0, awayGoals: 0 }); // Team C: 1 pt / 1 = 1

    const historyByTeam = buildHistoryByTeam([m1, m2, m3]);

    const profile = calculator.calculate({
      targetMatch,
      targetTeamId: TEAM_TARGET.id,
      historyByTeam,
    });

    expect(profile.averageOpponentPointsPerMatch).toBe(2 / 3);
    // Vérifier que ce n'est pas un string ou un nombre tronqué à 2 décimales
    expect(profile.averageOpponentPointsPerMatch).not.toBe(0.67);
    expect(typeof profile.averageOpponentPointsPerMatch).toBe('number');
    expect(Number.isFinite(profile.averageOpponentPointsPerMatch)).toBe(true);
  });
});
