/**
 * Fournisseur factice en mémoire — Phase 2.7 / Phase 3.2 Form 5.
 * Couche Infrastructure — implémente le port SportsDataProvider.
 *
 * Données entièrement fictives, déterministes et statiques.
 * Aucun appel réseau. Aucune lecture de variable d'environnement.
 * Aucune génération aléatoire. Aucune utilisation de l'horloge système.
 *
 * Phase 3.2 : ajout de matchs FINISHED pour les tests Form 5.
 * Tous les matchs FINISHED sont antérieurs aux matchs SCHEDULED (anti look-ahead).
 *
 * Référence : phase-2-7-functional-slice-validation-pack.md (DEC-005) / DEC-019
 */

import { SportsDataProvider } from '../../../application/ports/sports-data-provider.js';
import { NotImplementedError } from '../../../application/errors/index.js';
import { Competition } from '../../../domain/entities/competition.js';
import { Match } from '../../../domain/entities/match.js';
import { MatchStatus } from '../../../domain/value-objects/match-status.js';

// ---------------------------------------------------------------------------
// Données fictives statiques — équipes
// ---------------------------------------------------------------------------

const TEAM_ALPHA = {
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
} as const;

const TEAM_BETA = {
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
} as const;

const TEAM_GAMMA = {
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
} as const;

const TEAM_DELTA = {
  id: 'team-delta-004',
  name: 'Delta Athletic',
  shortName: 'Delta',
  tla: 'DLT',
  crestUrl: null,
  providerMetadata: {
    providerName: 'in-memory',
    externalId: 'team-004',
    lastUpdated: new Date('2099-01-01T00:00:00.000Z'),
  },
} as const;

const TEAM_EPSILON = {
  id: 'team-epsilon-005',
  name: 'Epsilon SC',
  shortName: 'Epsilon',
  tla: 'EPS',
  crestUrl: null,
  providerMetadata: {
    providerName: 'in-memory',
    externalId: 'team-005',
    lastUpdated: new Date('2099-01-01T00:00:00.000Z'),
  },
} as const;

const TEAM_ZETA = {
  id: 'team-zeta-006',
  name: 'Zeta Rovers',
  shortName: 'Zeta',
  tla: 'ZTR',
  crestUrl: null,
  providerMetadata: {
    providerName: 'in-memory',
    externalId: 'team-006',
    lastUpdated: new Date('2099-01-01T00:00:00.000Z'),
  },
} as const;

// ---------------------------------------------------------------------------
// Constantes de saison / compétition
// ---------------------------------------------------------------------------

export const IN_MEMORY_SEASON_ID = 'season-fl1-2099';
export const IN_MEMORY_COMPETITION_ID = 'comp-fl1';

// ---------------------------------------------------------------------------
// Score vide (matchs programmés — aucun résultat encore)
// ---------------------------------------------------------------------------

const EMPTY_SCORE = {
  halfTime: { home: null, away: null },
  fullTime: { home: null, away: null },
} as const;

// ---------------------------------------------------------------------------
// Matchs SCHEDULED — dates fixes approuvées par DEC-005
// ---------------------------------------------------------------------------

const FL1_SCHEDULED: Match[] = [
  {
    id: 'match-fl1-001',
    competitionId: IN_MEMORY_COMPETITION_ID,
    seasonId: IN_MEMORY_SEASON_ID,
    matchday: 1,
    utcDate: new Date('2099-08-14T18:00:00.000Z'),
    status: 'SCHEDULED' as MatchStatus,
    homeTeam: TEAM_ALPHA,
    awayTeam: TEAM_BETA,
    score: EMPTY_SCORE,
    providerMetadata: {
      providerName: 'in-memory',
      externalId: 'match-001',
      lastUpdated: new Date('2099-01-01T00:00:00.000Z'),
    },
  },
  {
    id: 'match-fl1-002',
    competitionId: IN_MEMORY_COMPETITION_ID,
    seasonId: IN_MEMORY_SEASON_ID,
    matchday: 1,
    utcDate: new Date('2099-08-15T20:00:00.000Z'),
    status: 'SCHEDULED' as MatchStatus,
    homeTeam: TEAM_GAMMA,
    awayTeam: TEAM_DELTA,
    score: EMPTY_SCORE,
    providerMetadata: {
      providerName: 'in-memory',
      externalId: 'match-002',
      lastUpdated: new Date('2099-01-01T00:00:00.000Z'),
    },
  },
  {
    id: 'match-fl1-003',
    competitionId: IN_MEMORY_COMPETITION_ID,
    seasonId: IN_MEMORY_SEASON_ID,
    matchday: 1,
    utcDate: new Date('2099-08-16T19:30:00.000Z'),
    status: 'SCHEDULED' as MatchStatus,
    homeTeam: TEAM_EPSILON,
    awayTeam: TEAM_ZETA,
    score: EMPTY_SCORE,
    providerMetadata: {
      providerName: 'in-memory',
      externalId: 'match-003',
      lastUpdated: new Date('2099-01-01T00:00:00.000Z'),
    },
  },
];

// ---------------------------------------------------------------------------
// Matchs FINISHED — historique Form 5 (tous antérieurs à 2099-08-14)
//
// Alpha FC  : 6 matchs (>5 — max 5 retenus après tri)
// Beta      : 2 matchs
// Gamma     : 4 matchs
// Delta     : 4 matchs
// Epsilon   : 1 match  (cas 1 résultat)
// Zeta      : 0 match  (cas INSUFFICIENT_DATA)
// ---------------------------------------------------------------------------

const FL1_FINISHED: Match[] = [
  // Alpha FC - matchday 5 (le plus récent) : WIN domicile
  {
    id: 'hist-fl1-101',
    competitionId: IN_MEMORY_COMPETITION_ID,
    seasonId: IN_MEMORY_SEASON_ID,
    matchday: 5,
    utcDate: new Date('2099-08-10T18:00:00.000Z'),
    status: 'FINISHED' as MatchStatus,
    homeTeam: TEAM_ALPHA,
    awayTeam: TEAM_GAMMA,
    score: { halfTime: { home: 1, away: 0 }, fullTime: { home: 2, away: 1 } },
    providerMetadata: { providerName: 'in-memory', externalId: 'hist-101', lastUpdated: new Date('2099-08-10T20:00:00.000Z') },
  },
  // Alpha FC - matchday 4 : WIN extérieur
  {
    id: 'hist-fl1-102',
    competitionId: IN_MEMORY_COMPETITION_ID,
    seasonId: IN_MEMORY_SEASON_ID,
    matchday: 4,
    utcDate: new Date('2099-08-07T18:00:00.000Z'),
    status: 'FINISHED' as MatchStatus,
    homeTeam: TEAM_DELTA,
    awayTeam: TEAM_ALPHA,
    score: { halfTime: { home: 0, away: 1 }, fullTime: { home: 0, away: 2 } },
    providerMetadata: { providerName: 'in-memory', externalId: 'hist-102', lastUpdated: new Date('2099-08-07T20:00:00.000Z') },
  },
  // Alpha FC - matchday 3 : DRAW
  {
    id: 'hist-fl1-103',
    competitionId: IN_MEMORY_COMPETITION_ID,
    seasonId: IN_MEMORY_SEASON_ID,
    matchday: 3,
    utcDate: new Date('2099-08-03T18:00:00.000Z'),
    status: 'FINISHED' as MatchStatus,
    homeTeam: TEAM_ALPHA,
    awayTeam: TEAM_EPSILON,
    score: { halfTime: { home: 0, away: 0 }, fullTime: { home: 1, away: 1 } },
    providerMetadata: { providerName: 'in-memory', externalId: 'hist-103', lastUpdated: new Date('2099-08-03T20:00:00.000Z') },
  },
  // Alpha FC - matchday 2 : LOSS domicile
  {
    id: 'hist-fl1-104',
    competitionId: IN_MEMORY_COMPETITION_ID,
    seasonId: IN_MEMORY_SEASON_ID,
    matchday: 2,
    utcDate: new Date('2099-07-28T18:00:00.000Z'),
    status: 'FINISHED' as MatchStatus,
    homeTeam: TEAM_ALPHA,
    awayTeam: TEAM_BETA,
    score: { halfTime: { home: 0, away: 1 }, fullTime: { home: 0, away: 2 } },
    providerMetadata: { providerName: 'in-memory', externalId: 'hist-104', lastUpdated: new Date('2099-07-28T20:00:00.000Z') },
  },
  // Alpha FC - matchday 2 (autre date) : LOSS extérieur
  {
    id: 'hist-fl1-105',
    competitionId: IN_MEMORY_COMPETITION_ID,
    seasonId: IN_MEMORY_SEASON_ID,
    matchday: 2,
    utcDate: new Date('2099-07-21T18:00:00.000Z'),
    status: 'FINISHED' as MatchStatus,
    homeTeam: TEAM_BETA,
    awayTeam: TEAM_ALPHA,
    score: { halfTime: { home: 2, away: 0 }, fullTime: { home: 3, away: 0 } },
    providerMetadata: { providerName: 'in-memory', externalId: 'hist-105', lastUpdated: new Date('2099-07-21T20:00:00.000Z') },
  },
  // Alpha FC - matchday 1 : WIN (6ème — exclu par max 5)
  {
    id: 'hist-fl1-106',
    competitionId: IN_MEMORY_COMPETITION_ID,
    seasonId: IN_MEMORY_SEASON_ID,
    matchday: 1,
    utcDate: new Date('2099-07-14T18:00:00.000Z'),
    status: 'FINISHED' as MatchStatus,
    homeTeam: TEAM_ALPHA,
    awayTeam: TEAM_DELTA,
    score: { halfTime: { home: 1, away: 0 }, fullTime: { home: 2, away: 0 } },
    providerMetadata: { providerName: 'in-memory', externalId: 'hist-106', lastUpdated: new Date('2099-07-14T20:00:00.000Z') },
  },
  // Beta United - 2 matchs
  {
    id: 'hist-fl1-201',
    competitionId: IN_MEMORY_COMPETITION_ID,
    seasonId: IN_MEMORY_SEASON_ID,
    matchday: 3,
    utcDate: new Date('2099-08-05T18:00:00.000Z'),
    status: 'FINISHED' as MatchStatus,
    homeTeam: TEAM_BETA,
    awayTeam: TEAM_ALPHA,
    score: { halfTime: { home: 1, away: 0 }, fullTime: { home: 2, away: 0 } },
    providerMetadata: { providerName: 'in-memory', externalId: 'hist-201', lastUpdated: new Date('2099-08-05T20:00:00.000Z') },
  },
  {
    id: 'hist-fl1-202',
    competitionId: IN_MEMORY_COMPETITION_ID,
    seasonId: IN_MEMORY_SEASON_ID,
    matchday: 2,
    utcDate: new Date('2099-07-29T18:00:00.000Z'),
    status: 'FINISHED' as MatchStatus,
    homeTeam: TEAM_EPSILON,
    awayTeam: TEAM_BETA,
    score: { halfTime: { home: 1, away: 1 }, fullTime: { home: 1, away: 1 } },
    providerMetadata: { providerName: 'in-memory', externalId: 'hist-202', lastUpdated: new Date('2099-07-29T20:00:00.000Z') },
  },
  // Gamma City - 4 matchs
  {
    id: 'hist-fl1-301',
    competitionId: IN_MEMORY_COMPETITION_ID,
    seasonId: IN_MEMORY_SEASON_ID,
    matchday: 4,
    utcDate: new Date('2099-08-09T18:00:00.000Z'),
    status: 'FINISHED' as MatchStatus,
    homeTeam: TEAM_GAMMA,
    awayTeam: TEAM_BETA,
    score: { halfTime: { home: 0, away: 0 }, fullTime: { home: 1, away: 0 } },
    providerMetadata: { providerName: 'in-memory', externalId: 'hist-301', lastUpdated: new Date('2099-08-09T20:00:00.000Z') },
  },
  {
    id: 'hist-fl1-302',
    competitionId: IN_MEMORY_COMPETITION_ID,
    seasonId: IN_MEMORY_SEASON_ID,
    matchday: 3,
    utcDate: new Date('2099-08-04T18:00:00.000Z'),
    status: 'FINISHED' as MatchStatus,
    homeTeam: TEAM_BETA,
    awayTeam: TEAM_GAMMA,
    score: { halfTime: { home: 0, away: 1 }, fullTime: { home: 1, away: 2 } },
    providerMetadata: { providerName: 'in-memory', externalId: 'hist-302', lastUpdated: new Date('2099-08-04T20:00:00.000Z') },
  },
  {
    id: 'hist-fl1-303',
    competitionId: IN_MEMORY_COMPETITION_ID,
    seasonId: IN_MEMORY_SEASON_ID,
    matchday: 2,
    utcDate: new Date('2099-07-27T18:00:00.000Z'),
    status: 'FINISHED' as MatchStatus,
    homeTeam: TEAM_GAMMA,
    awayTeam: TEAM_DELTA,
    score: { halfTime: { home: 0, away: 1 }, fullTime: { home: 0, away: 1 } },
    providerMetadata: { providerName: 'in-memory', externalId: 'hist-303', lastUpdated: new Date('2099-07-27T20:00:00.000Z') },
  },
  {
    id: 'hist-fl1-304',
    competitionId: IN_MEMORY_COMPETITION_ID,
    seasonId: IN_MEMORY_SEASON_ID,
    matchday: 1,
    utcDate: new Date('2099-07-20T18:00:00.000Z'),
    status: 'FINISHED' as MatchStatus,
    homeTeam: TEAM_DELTA,
    awayTeam: TEAM_GAMMA,
    score: { halfTime: { home: 0, away: 0 }, fullTime: { home: 0, away: 0 } },
    providerMetadata: { providerName: 'in-memory', externalId: 'hist-304', lastUpdated: new Date('2099-07-20T20:00:00.000Z') },
  },
  // Delta Athletic - 4 matchs
  {
    id: 'hist-fl1-401',
    competitionId: IN_MEMORY_COMPETITION_ID,
    seasonId: IN_MEMORY_SEASON_ID,
    matchday: 4,
    utcDate: new Date('2099-08-08T18:00:00.000Z'),
    status: 'FINISHED' as MatchStatus,
    homeTeam: TEAM_DELTA,
    awayTeam: TEAM_EPSILON,
    score: { halfTime: { home: 1, away: 0 }, fullTime: { home: 2, away: 1 } },
    providerMetadata: { providerName: 'in-memory', externalId: 'hist-401', lastUpdated: new Date('2099-08-08T20:00:00.000Z') },
  },
  {
    id: 'hist-fl1-402',
    competitionId: IN_MEMORY_COMPETITION_ID,
    seasonId: IN_MEMORY_SEASON_ID,
    matchday: 3,
    utcDate: new Date('2099-08-02T18:00:00.000Z'),
    status: 'FINISHED' as MatchStatus,
    homeTeam: TEAM_BETA,
    awayTeam: TEAM_DELTA,
    score: { halfTime: { home: 1, away: 0 }, fullTime: { home: 2, away: 0 } },
    providerMetadata: { providerName: 'in-memory', externalId: 'hist-402', lastUpdated: new Date('2099-08-02T20:00:00.000Z') },
  },
  {
    id: 'hist-fl1-403',
    competitionId: IN_MEMORY_COMPETITION_ID,
    seasonId: IN_MEMORY_SEASON_ID,
    matchday: 2,
    utcDate: new Date('2099-07-28T14:00:00.000Z'),
    status: 'FINISHED' as MatchStatus,
    homeTeam: TEAM_DELTA,
    awayTeam: TEAM_ALPHA,
    score: { halfTime: { home: 1, away: 1 }, fullTime: { home: 2, away: 2 } },
    providerMetadata: { providerName: 'in-memory', externalId: 'hist-403', lastUpdated: new Date('2099-07-28T16:00:00.000Z') },
  },
  {
    id: 'hist-fl1-404',
    competitionId: IN_MEMORY_COMPETITION_ID,
    seasonId: IN_MEMORY_SEASON_ID,
    matchday: 1,
    utcDate: new Date('2099-07-21T14:00:00.000Z'),
    status: 'FINISHED' as MatchStatus,
    homeTeam: TEAM_GAMMA,
    awayTeam: TEAM_DELTA,
    score: { halfTime: { home: 0, away: 0 }, fullTime: { home: 0, away: 0 } },
    providerMetadata: { providerName: 'in-memory', externalId: 'hist-404', lastUpdated: new Date('2099-07-21T16:00:00.000Z') },
  },
  // Epsilon SC - 1 seul match (cas 1 résultat)
  {
    id: 'hist-fl1-501',
    competitionId: IN_MEMORY_COMPETITION_ID,
    seasonId: IN_MEMORY_SEASON_ID,
    matchday: 3,
    utcDate: new Date('2099-08-06T18:00:00.000Z'),
    status: 'FINISHED' as MatchStatus,
    homeTeam: TEAM_EPSILON,
    awayTeam: TEAM_DELTA,
    score: { halfTime: { home: 0, away: 0 }, fullTime: { home: 1, away: 0 } },
    providerMetadata: { providerName: 'in-memory', externalId: 'hist-501', lastUpdated: new Date('2099-08-06T20:00:00.000Z') },
  },
  // Zeta Rovers : 0 match FINISHED intentionnel (cas INSUFFICIENT_DATA)
];

// Tous les matchs FL1 (SCHEDULED + FINISHED)
const FL1_ALL_MATCHES: Match[] = [...FL1_SCHEDULED, ...FL1_FINISHED];

// ---------------------------------------------------------------------------
// Fournisseur factice
// ---------------------------------------------------------------------------

export class InMemorySportsDataProvider implements SportsDataProvider {
  /**
   * Non implémenté pour la Phase 2.7.
   */
  getCompetitions(): Promise<Competition[]> {
    throw new NotImplementedError('InMemorySportsDataProvider.getCompetitions');
  }

  /**
   * Retourne les matchs FL1 filtrés par plage temporelle optionnelle.
   * Retourne un tableau vide pour toute autre compétition.
   *
   * Phase 3.2 : retourne aussi les matchs FINISHED.
   * Le filtrage métier par statut est délégué à la couche Application (DEC-019.5).
   */
  getMatches(
    competitionCode: string,
    fromDate?: Date,
    toDate?: Date
  ): Promise<Match[]> {
    if (competitionCode !== 'FL1') {
      return Promise.resolve([]);
    }

    let matches = [...FL1_ALL_MATCHES];

    if (fromDate !== undefined) {
      matches = matches.filter((m) => m.utcDate >= fromDate);
    }
    if (toDate !== undefined) {
      matches = matches.filter((m) => m.utcDate <= toDate);
    }

    return Promise.resolve(matches);
  }

  /**
   * Non implémenté pour la Phase 2.7.
   */
  getMatchDetails(_externalMatchId: string): Promise<Match> {
    throw new NotImplementedError(
      'InMemorySportsDataProvider.getMatchDetails'
    );
  }
}
