/**
 * Cas d'usage — Lister les matchs programmés.
 * Couche Application — dépend uniquement du domaine et du port.
 *
 * Phase 2.7 — Première tranche fonctionnelle.
 * Seule la compétition FL1 est disponible.
 *
 * Référence : phase-2-7-functional-slice-validation-pack.md (DEC-005)
 */

import { SportsDataProvider } from '../ports/sports-data-provider.js';
import { Match } from '../../domain/entities/match.js';
import { addUtcDays } from '../../shared/date-utils.js';

// ---------------------------------------------------------------------------
// Erreur métier — compétition non disponible
// ---------------------------------------------------------------------------

/**
 * Levée lorsque le code de compétition demandé n'est pas disponible.
 * Expose le code machine exact : COMPETITION_NOT_AVAILABLE.
 * Aucune dépendance HTTP.
 */
export class CompetitionNotAvailableError extends Error {
  public readonly code = 'COMPETITION_NOT_AVAILABLE' as const;

  constructor(competitionCode: string) {
    super(`Compétition non disponible : ${competitionCode}`);
    this.name = 'CompetitionNotAvailableError';
  }
}

// ---------------------------------------------------------------------------
// Résultat du cas d'usage
// ---------------------------------------------------------------------------

export interface ScheduledMatchesResult {
  competitionCode: string;
  matches: Match[];
}

// ---------------------------------------------------------------------------
// Cas d'usage
// ---------------------------------------------------------------------------

export class ListScheduledMatchesUseCase {
  private readonly clockFn: () => Date;

  constructor(
    private readonly provider: SportsDataProvider,
    clockFn?: () => Date
  ) {
    this.clockFn = clockFn ?? (() => new Date());
  }

  /**
   * Retourne les matchs SCHEDULED pour la compétition demandée.
   *
   * Conformément à DEC-020.5 :
   * - Transmet explicitement la fenêtre [now, now + 7 jours) UTC au provider.
   * - Filtre les matchs reçus pour ne conserver que les statuts SCHEDULED.
   *
   * @param competitionCode Code de compétition normalisé (seul "FL1" est accepté)
   * @throws CompetitionNotAvailableError si le code n'est pas "FL1"
   */
  async execute(competitionCode: string): Promise<ScheduledMatchesResult> {
    if (competitionCode !== 'FL1') {
      throw new CompetitionNotAvailableError(competitionCode);
    }

    const now = this.clockFn();
    const scheduledTo = addUtcDays(now, 7);

    const allMatches = await this.provider.getMatches(
      competitionCode,
      now,
      scheduledTo
    );
    const scheduledMatches = allMatches.filter(
      (match) => match.status === 'SCHEDULED'
    );

    return {
      competitionCode,
      matches: scheduledMatches,
    };
  }
}
