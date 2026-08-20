/**
 * Tests unitaires — MomentumCalculator (DEC-032 / DEC-033 Phase 3.6).
 * Valide l'ensemble des règles de calcul, fenêtres adaptatives, étanchéité de saison et invariants.
 */

import { describe, it, expect } from 'vitest';
import { MomentumCalculator } from '../../src/domain/services/momentum-calculator.js';
import { Match } from '../../src/domain/entities/match.js';
import { Team } from '../../src/domain/entities/team.js';
import { MatchStatus } from '../../src/domain/value-objects/match-status.js';

const TEAM_ALPHA: Team = {
  id: 'team-alpha-001',
  name: 'Alpha FC',
  shortName: 'Alpha',
  tla: 'ALF',
  crestUrl: null,
  providerMetadata: {
    providerName: 'in-memory',
    externalId: 'team-001',
    lastUpdated: new Date('2099-01-01T00:00:00.000Z'),
  },
};

const TEAM_BETA: Team = {
  id: 'team-beta-002',
  name: 'Beta United',
  shortName: 'Beta',
  tla: 'BTU',
  crestUrl: null,
  providerMetadata: {
    providerName: 'in-memory',
    externalId: 'team-002',
    lastUpdated: new Date('2099-01-01T00:00:00.000Z'),
  },
};

const TEAM_GAMMA: Team = {
  id: 'team-gamma-003',
  name: 'Gamma City',
  shortName: 'Gamma',
  tla: 'GCC',
  crestUrl: null,
  providerMetadata: {
    providerName: 'in-memory',
    externalId: 'team-003',
    lastUpdated: new Date('2099-01-01T00:00:00.000Z'),
  },
};

function createMatch(
  id: string,
  utcDateStr: string,
  homeTeam: Team,
  awayTeam: Team,
  options: {
    competitionId?: string;
    seasonId?: string;
    status?: MatchStatus;
    scoreHome?: number | null;
    scoreAway?: number | null;
  } = {}
): Match {
  return {
    id,
    competitionId: options.competitionId ?? 'FL1',
    seasonId: options.seasonId ?? 'season-2025',
    matchday: 1,
    utcDate: new Date(utcDateStr),
    status: options.status ?? 'FINISHED',
    homeTeam,
    awayTeam,
    score: {
      halfTime: { home: null, away: null },
      fullTime: {
        home: options.scoreHome !== undefined ? options.scoreHome : 1,
        away: options.scoreAway !== undefined ? options.scoreAway : 0,
      },
    },
    providerMetadata: {
      providerName: 'test',
      externalId: id,
      lastUpdated: new Date(utcDateStr),
    },
  };
}

describe('MomentumCalculator', () => {
  const calculator = new MomentumCalculator();

  const targetMatch = createMatch(
    'target-001',
    '2025-11-20T20:00:00.000Z',
    TEAM_ALPHA,
    TEAM_BETA,
    { status: 'SCHEDULED', scoreHome: null, scoreAway: null }
  );

  describe('Seuils de disponibilité et fenêtres adaptatives', () => {
    it('retourne INSUFFICIENT_DATA si aucun match historique', () => {
      const profile = calculator.calculate(TEAM_ALPHA.id, targetMatch, []);
      expect(profile.availability).toBe('INSUFFICIENT_DATA');
      expect(profile.windowSize).toBeNull();
      expect(profile.recent).toBeNull();
      expect(profile.previous).toBeNull();
      expect(profile.pointsPerMatchDelta).toBeNull();
      expect(profile.goalDifferencePerMatchDelta).toBeNull();
    });

    it('retourne INSUFFICIENT_DATA si moins de 6 matchs éligibles (1 à 5)', () => {
      for (let count = 1; count <= 5; count++) {
        const matches: Match[] = [];
        for (let i = 1; i <= count; i++) {
          matches.push(
            createMatch(
              `m-00${i}`,
              `2025-11-0${i}T20:00:00.000Z`,
              TEAM_ALPHA,
              TEAM_BETA,
              { scoreHome: 2, scoreAway: 1 }
            )
          );
        }
        const profile = calculator.calculate(TEAM_ALPHA.id, targetMatch, matches);
        expect(profile.availability).toBe('INSUFFICIENT_DATA');
        expect(profile.windowSize).toBeNull();
        expect(profile.recent).toBeNull();
      }
    });

    it('calcule une fenêtre 3v3 si exactement 6 matchs éligibles', () => {
      const matches: Match[] = [];
      for (let i = 1; i <= 6; i++) {
        matches.push(
          createMatch(
            `m-00${i}`,
            `2025-11-0${i}T20:00:00.000Z`,
            TEAM_ALPHA,
            TEAM_BETA,
            { scoreHome: 1, scoreAway: 0 }
          )
        );
      }
      const profile = calculator.calculate(TEAM_ALPHA.id, targetMatch, matches);
      expect(profile.availability).toBe('AVAILABLE');
      expect(profile.windowSize).toBe(3);
      expect(profile.recent?.sampleSize).toBe(3);
      expect(profile.previous?.sampleSize).toBe(3);
    });

    it('calcule une fenêtre 3v3 si 7 matchs éligibles (le 7e plus ancien est ignoré)', () => {
      const matches: Match[] = [];
      matches.push(
        createMatch(
          'm-001',
          '2025-11-01T20:00:00.000Z',
          TEAM_ALPHA,
          TEAM_BETA,
          { scoreHome: 0, scoreAway: 3 }
        )
      );
      for (let i = 2; i <= 7; i++) {
        matches.push(
          createMatch(
            `m-00${i}`,
            `2025-11-0${i}T20:00:00.000Z`,
            TEAM_ALPHA,
            TEAM_BETA,
            { scoreHome: 2, scoreAway: 0 }
          )
        );
      }
      const profile = calculator.calculate(TEAM_ALPHA.id, targetMatch, matches);
      expect(profile.availability).toBe('AVAILABLE');
      expect(profile.windowSize).toBe(3);
      expect(profile.recent?.pointsPerMatch).toBe(3);
      expect(profile.recent?.goalDifferencePerMatch).toBe(2);
      expect(profile.previous?.pointsPerMatch).toBe(3);
      expect(profile.pointsPerMatchDelta).toBe(0);
    });

    it('calcule une fenêtre 4v4 si 8 ou 9 matchs éligibles', () => {
      const matches8: Match[] = [];
      for (let i = 1; i <= 8; i++) {
        matches8.push(
          createMatch(
            `m-0${i}`,
            `2025-11-0${i}T20:00:00.000Z`,
            TEAM_ALPHA,
            TEAM_BETA
          )
        );
      }
      const profile8 = calculator.calculate(TEAM_ALPHA.id, targetMatch, matches8);
      expect(profile8.availability).toBe('AVAILABLE');
      expect(profile8.windowSize).toBe(4);

      const matches9 = [
        ...matches8,
        createMatch(
          'm-09',
          '2025-11-09T20:00:00.000Z',
          TEAM_ALPHA,
          TEAM_BETA
        ),
      ];
      const profile9 = calculator.calculate(TEAM_ALPHA.id, targetMatch, matches9);
      expect(profile9.availability).toBe('AVAILABLE');
      expect(profile9.windowSize).toBe(4);
    });

    it('calcule une fenêtre 5v5 si 10 matchs ou plus', () => {
      const matches: Match[] = [];
      for (let i = 1; i <= 12; i++) {
        const day = i < 10 ? `0${i}` : `${i}`;
        matches.push(
          createMatch(
            `m-${day}`,
            `2025-11-${day}T20:00:00.000Z`,
            TEAM_ALPHA,
            TEAM_BETA
          )
        );
      }
      const profile = calculator.calculate(TEAM_ALPHA.id, targetMatch, matches);
      expect(profile.availability).toBe('AVAILABLE');
      expect(profile.windowSize).toBe(5);
      expect(profile.recent?.sampleSize).toBe(5);
      expect(profile.previous?.sampleSize).toBe(5);
    });
  });

  describe('Règles d’éligibilité et étanchéité de saison', () => {
    it('exclut strictement les matchs de saisons antérieures (TARGET_SEASON_ONLY)', () => {
      const matches: Match[] = [];
      for (let i = 1; i <= 4; i++) {
        matches.push(
          createMatch(
            `m-curr-0${i}`,
            `2025-11-0${i}T20:00:00.000Z`,
            TEAM_ALPHA,
            TEAM_BETA,
            { seasonId: 'season-2025' }
          )
        );
      }
      for (let i = 1; i <= 4; i++) {
        matches.push(
          createMatch(
            `m-prev-0${i}`,
            `2025-05-0${i}T20:00:00.000Z`,
            TEAM_ALPHA,
            TEAM_BETA,
            { seasonId: 'season-2024' }
          )
        );
      }
      const profile = calculator.calculate(TEAM_ALPHA.id, targetMatch, matches);
      expect(profile.availability).toBe('INSUFFICIENT_DATA');
    });

    it('exclut les matchs non FINISHED', () => {
      const matches: Match[] = [];
      for (let i = 1; i <= 5; i++) {
        matches.push(
          createMatch(
            `m-fin-0${i}`,
            `2025-11-0${i}T20:00:00.000Z`,
            TEAM_ALPHA,
            TEAM_BETA,
            { status: 'FINISHED' }
          )
        );
      }
      matches.push(
        createMatch(
          'm-postponed',
          '2025-11-06T20:00:00.000Z',
          TEAM_ALPHA,
          TEAM_BETA,
          { status: 'POSTPONED' }
        )
      );
      matches.push(
        createMatch(
          'm-scheduled',
          '2025-11-07T20:00:00.000Z',
          TEAM_ALPHA,
          TEAM_BETA,
          { status: 'SCHEDULED' }
        )
      );
      const profile = calculator.calculate(TEAM_ALPHA.id, targetMatch, matches);
      expect(profile.availability).toBe('INSUFFICIENT_DATA');
    });

    it('exclut les matchs sans score fullTime complet', () => {
      const matches: Match[] = [];
      for (let i = 1; i <= 5; i++) {
        matches.push(
          createMatch(
            `m-ok-0${i}`,
            `2025-11-0${i}T20:00:00.000Z`,
            TEAM_ALPHA,
            TEAM_BETA,
            { scoreHome: 1, scoreAway: 0 }
          )
        );
      }
      matches.push(
        createMatch(
          'm-incomplete',
          '2025-11-06T20:00:00.000Z',
          TEAM_ALPHA,
          TEAM_BETA,
          { scoreHome: null, scoreAway: null }
        )
      );
      const profile = calculator.calculate(TEAM_ALPHA.id, targetMatch, matches);
      expect(profile.availability).toBe('INSUFFICIENT_DATA');
    });

    it('exclut les matchs futurs ou de même timestamp que le targetMatch', () => {
      const matches: Match[] = [];
      for (let i = 1; i <= 5; i++) {
        matches.push(
          createMatch(
            `m-past-0${i}`,
            `2025-11-0${i}T20:00:00.000Z`,
            TEAM_ALPHA,
            TEAM_BETA
          )
        );
      }
      matches.push(
        createMatch(
          'm-same-time',
          '2025-11-20T20:00:00.000Z',
          TEAM_ALPHA,
          TEAM_BETA
        )
      );
      matches.push(
        createMatch(
          'm-future',
          '2025-11-21T20:00:00.000Z',
          TEAM_ALPHA,
          TEAM_BETA
        )
      );
      const profile = calculator.calculate(TEAM_ALPHA.id, targetMatch, matches);
      expect(profile.availability).toBe('INSUFFICIENT_DATA');
    });
  });

  describe('Calculs des métriques et perspectives Domicile / Extérieur', () => {
    it('calcule correctement les points, buts et deltas avec perspective HOME et AWAY', () => {
      const matches: Match[] = [
        createMatch('m-01', '2025-11-01T20:00:00.000Z', TEAM_ALPHA, TEAM_BETA, {
          scoreHome: 1,
          scoreAway: 0,
        }),
        createMatch('m-02', '2025-11-02T20:00:00.000Z', TEAM_GAMMA, TEAM_ALPHA, {
          scoreHome: 2,
          scoreAway: 2,
        }),
        createMatch('m-03', '2025-11-03T20:00:00.000Z', TEAM_ALPHA, TEAM_BETA, {
          scoreHome: 0,
          scoreAway: 1,
        }),
        createMatch('m-04', '2025-11-04T20:00:00.000Z', TEAM_BETA, TEAM_ALPHA, {
          scoreHome: 0,
          scoreAway: 3,
        }),
        createMatch('m-05', '2025-11-05T20:00:00.000Z', TEAM_ALPHA, TEAM_GAMMA, {
          scoreHome: 2,
          scoreAway: 1,
        }),
        createMatch('m-06', '2025-11-06T20:00:00.000Z', TEAM_GAMMA, TEAM_ALPHA, {
          scoreHome: 1,
          scoreAway: 1,
        }),
      ];

      const profile = calculator.calculate(TEAM_ALPHA.id, targetMatch, matches);
      expect(profile.availability).toBe('AVAILABLE');
      expect(profile.windowSize).toBe(3);

      // Previous (m-01: W(3, 1-0), m-02: D(1, 2-2), m-03: L(0, 0-1) => pts=4, GF=3, GA=3)
      expect(profile.previous?.pointsPerMatch).toBeCloseTo(4 / 3, 5);
      expect(profile.previous?.goalsForPerMatch).toBe(1.0);
      expect(profile.previous?.goalsAgainstPerMatch).toBe(1.0);
      expect(profile.previous?.goalDifferencePerMatch).toBe(0.0);

      // Recent (m-04: W(3, 3-0), m-05: W(3, 2-1), m-06: D(1, 1-1) => pts=7, GF=6, GA=2)
      expect(profile.recent?.pointsPerMatch).toBeCloseTo(7 / 3, 5);
      expect(profile.recent?.goalsForPerMatch).toBe(2.0);
      expect(profile.recent?.goalsAgainstPerMatch).toBeCloseTo(2 / 3, 5);
      expect(profile.recent?.goalDifferencePerMatch).toBeCloseTo(4 / 3, 5);

      // Deltas
      expect(profile.pointsPerMatchDelta).toBeCloseTo(7 / 3 - 4 / 3, 5);
      expect(profile.goalDifferencePerMatchDelta).toBeCloseTo(4 / 3 - 0.0, 5);
    });

    it('résout les égalités de utcDate par tie-break sur Match.id DESC', () => {
      const matches: Match[] = [
        createMatch('m-01', '2025-11-01T20:00:00.000Z', TEAM_ALPHA, TEAM_BETA, {
          scoreHome: 0,
          scoreAway: 0,
        }),
        createMatch('m-02', '2025-11-01T20:00:00.000Z', TEAM_ALPHA, TEAM_BETA, {
          scoreHome: 0,
          scoreAway: 0,
        }),
        createMatch('m-03', '2025-11-01T20:00:00.000Z', TEAM_ALPHA, TEAM_BETA, {
          scoreHome: 0,
          scoreAway: 0,
        }),
        createMatch('m-04', '2025-11-01T20:00:00.000Z', TEAM_ALPHA, TEAM_BETA, {
          scoreHome: 1,
          scoreAway: 0,
        }),
        createMatch('m-05', '2025-11-01T20:00:00.000Z', TEAM_ALPHA, TEAM_BETA, {
          scoreHome: 1,
          scoreAway: 0,
        }),
        createMatch('m-06', '2025-11-01T20:00:00.000Z', TEAM_ALPHA, TEAM_BETA, {
          scoreHome: 1,
          scoreAway: 0,
        }),
      ];

      const profile = calculator.calculate(TEAM_ALPHA.id, targetMatch, matches);
      expect(profile.availability).toBe('AVAILABLE');
      expect(profile.recent?.pointsPerMatch).toBe(3);
      expect(profile.previous?.pointsPerMatch).toBe(1);
      expect(profile.pointsPerMatchDelta).toBe(2);
    });

    it('ne mute pas le tableau de matchs en entrée', () => {
      const matches: Match[] = [];
      for (let i = 1; i <= 6; i++) {
        matches.push(
          createMatch(
            `m-00${i}`,
            `2025-11-0${i}T20:00:00.000Z`,
            TEAM_ALPHA,
            TEAM_BETA
          )
        );
      }
      const frozenMatches = Object.freeze([...matches]);
      expect(() => {
        calculator.calculate(TEAM_ALPHA.id, targetMatch, frozenMatches);
      }).not.toThrow();
    });
  });
});
