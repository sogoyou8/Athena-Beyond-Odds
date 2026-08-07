/**
 * Entité normalisée — Match.
 * Couche Domain — aucune dépendance externe.
 */

import { Team } from './team.js';
import { MatchStatus } from '../value-objects/match-status.js';
import { Score } from '../value-objects/score.js';
import { ProviderMetadata } from '../value-objects/provider-metadata.js';

export interface Match {
  readonly id: string;
  readonly competitionId: string;
  readonly seasonId: string;
  readonly matchday: number;
  readonly utcDate: Date;
  readonly status: MatchStatus;
  readonly homeTeam: Team;
  readonly awayTeam: Team;
  readonly score: Score;
  readonly providerMetadata: ProviderMetadata;
}
