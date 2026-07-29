/**
 * Fournisseur factice en mémoire — Phase 2.7.
 * Couche Infrastructure — implémente le port SportsDataProvider.
 *
 * Données entièrement fictives, déterministes et statiques.
 * Aucun appel réseau. Aucune lecture de variable d'environnement.
 * Aucune génération aléatoire. Aucune utilisation de l'horloge système.
 *
 * Référence : phase-2-7-functional-slice-validation-pack.md (DEC-005)
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
// Données fictives statiques — saison
// ---------------------------------------------------------------------------

const SEASON_2099 = {
  id: 'season-fl1-2099',
  startYear: 2099,
  endYear: 2100,
  currentMatchday: 1,
  providerMetadata: {
    providerName: 'in-memory',
    externalId: 'season-2099',
    lastUpdated: new Date('2099-01-01T00:00:00.000Z'),
  },
} as const;

// ---------------------------------------------------------------------------
// Score vide (matchs programmés — aucun résultat encore)
// ---------------------------------------------------------------------------

const EMPTY_SCORE = {
  halfTime: { home: null, away: null },
  fullTime: { home: null, away: null },
} as const;

// ---------------------------------------------------------------------------
// Trois matchs fictifs — dates fixes approuvées par DEC-005
// ---------------------------------------------------------------------------

const FL1_MATCHES: Match[] = [
  {
    id: 'match-fl1-001',
    competitionId: 'comp-fl1',
    seasonId: 'season-fl1-2099',
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
    competitionId: 'comp-fl1',
    seasonId: 'season-fl1-2099',
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
    competitionId: 'comp-fl1',
    seasonId: 'season-fl1-2099',
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
   * Retourne les trois matchs fictifs pour FL1.
   * Retourne un tableau vide pour toute autre compétition.
   */
  getMatches(
    competitionCode: string,
    _fromDate?: Date,
    _toDate?: Date
  ): Promise<Match[]> {
    if (competitionCode === 'FL1') {
      return Promise.resolve([...FL1_MATCHES]);
    }
    return Promise.resolve([]);
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
