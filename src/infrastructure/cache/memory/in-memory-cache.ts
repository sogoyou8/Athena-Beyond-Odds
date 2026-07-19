/**
 * Frontière technique — Cache mémoire local.
 * Couche Infrastructure — implémente le port SportsDataProvider (décorateur).
 *
 * FRONTIÈRE PHASE 2.6 — Aucune politique de cache, aucun TTL, aucun stockage.
 * Délègue systématiquement au fournisseur sous-jacent sans mise en cache.
 * L'implémentation réelle du cache avec TTL sera ajoutée en Phase 3.
 *
 * Référence : in-memory-cache-design.md (Phase 2.5)
 */

import { SportsDataProvider } from '../../../application/ports/sports-data-provider.js';
import { Competition } from '../../../domain/entities/competition.js';
import { Match } from '../../../domain/entities/match.js';

export class InMemoryCache implements SportsDataProvider {
  constructor(private readonly next: SportsDataProvider) {}

  getCompetitions(): Promise<Competition[]> {
    return this.next.getCompetitions();
  }

  getMatches(
    competitionCode: string,
    fromDate?: Date,
    toDate?: Date
  ): Promise<Match[]> {
    return this.next.getMatches(competitionCode, fromDate, toDate);
  }

  getMatchDetails(externalMatchId: string): Promise<Match> {
    return this.next.getMatchDetails(externalMatchId);
  }
}
