/**
 * Frontière technique — Adaptateur football-data.org.
 * Couche Infrastructure — implémente le port SportsDataProvider.
 *
 * FRONTIÈRE PHASE 2.6 — Aucun appel réseau réel.
 * Aucune logique de throttle, quota ou mapping.
 * L'implémentation réelle sera ajoutée en Phase 3.
 *
 * Référence : football-data-org-adapter-design.md (Phase 2.5)
 */

import { SportsDataProvider } from '../../../application/ports/sports-data-provider.js';
import { NotImplementedError } from '../../../application/errors/index.js';
import { Competition } from '../../../domain/entities/competition.js';
import { Match } from '../../../domain/entities/match.js';

export class FootballDataOrgAdapter implements SportsDataProvider {
  getCompetitions(): Promise<Competition[]> {
    throw new NotImplementedError('FootballDataOrgAdapter.getCompetitions');
  }

  getMatches(
    _competitionCode: string,
    _fromDate?: Date,
    _toDate?: Date
  ): Promise<Match[]> {
    throw new NotImplementedError('FootballDataOrgAdapter.getMatches');
  }

  getMatchDetails(_externalMatchId: string): Promise<Match> {
    throw new NotImplementedError('FootballDataOrgAdapter.getMatchDetails');
  }
}
